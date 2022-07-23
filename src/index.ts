import axios from 'axios';
import {
  TASK_COMPILE_SOLIDITY_COMPILE_JOB,
  TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
  TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH
} from 'hardhat/builtin-tasks/task-names';
import { task, types } from 'hardhat/config';
import {
  CompilationJob, DependencyGraph, HardhatRuntimeEnvironment
} from 'hardhat/types';
import { getConfig } from './config';

import './type-extensions';
import { Build, KriptonioUploadConfig } from './types';

async function uploadToKriptonio(
  config: KriptonioUploadConfig,
  hre: HardhatRuntimeEnvironment
) {
  const artifact = await hre.artifacts.readArtifact(config.contract);

  const dependencyGraph: DependencyGraph = await hre.run(
    TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH,
    {
      sourceNames: [artifact.sourceName],
    }
  );

  const resolvedFiles = dependencyGraph
    .getResolvedFiles()
    .filter((resolvedFile) => {
      return resolvedFile.sourceName === artifact.sourceName;
    });

  const compilationJob: CompilationJob = await hre.run(
    TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
    {
      dependencyGraph,
      file: resolvedFiles[0],
    }
  );

  const build: Build = await hre.run(TASK_COMPILE_SOLIDITY_COMPILE_JOB, {
    compilationJob,
    compilationJobs: [compilationJob],
    compilationJobIndex: 0,
    emitsArtifacts: false,
    quiet: false,
  });

  try {
    const response = await axios({
      method: 'POST',
      url: config.apiUrl,
      headers: {
        'x-access-token': config.accessToken,
        'Content-Type': 'application/json',
      },
      data: {
        name: config.name,
        blockchain: config.blockchain,
        walletAddress: config.wallet,
        contractFile: artifact.sourceName,
        contractName: config.contract,
        contractStandardJson: JSON.stringify(build.input),
      },
    });

    console.log(
      `Created => ${config.appUrl}/smart-contracts/${response.data.id}/general`
    );
  } catch (e) {
    if (e?.response?.data?.code) {
      throw new Error(`Server error. ${formatError(e.response.data)}`);
    }

    console.error(`Error while uploading file: ${e?.message}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatError(error: any) {
  const parts = [];
  if (error.code) {
    parts.push(error.code);
  }

  if (error.subCode) {
    parts.push(error.subCode);
  }

  if (error.details) {
    parts.push(error.details);
  }

  return parts.join('. ');
}

task('kriptonio-upload', 'Upload your contract to Kriptonio')
  .addOptionalParam('contract', 'Contract name to upload', undefined, types.string)
  .addOptionalParam('accessToken', 'Access token', undefined, types.string)
  .addOptionalParam('wallet', 'Wallet address to use', undefined, types.string)
  .addOptionalParam('blockchain', 'Blockchain to use', undefined, types.string)
  .addOptionalParam(
    'name',
    'Smart contract name on kriptonio',
    undefined,
    types.string
  )
  .addOptionalParam(
    'apiUrl',
    'Kriptonio API endpoint',
    undefined,
    types.string
  )
  .addOptionalParam(
    'appUrl',
    'Kriptonio Web App URL',
    undefined,
    types.string
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    await hre.run('compile');
    await uploadToKriptonio(getConfig(taskArgs, hre.config.kriptonio), hre);
  });
