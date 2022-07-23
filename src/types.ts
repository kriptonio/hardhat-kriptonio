import { CompilationJob, CompilerInput, CompilerOutput } from "hardhat/types";

export interface Build {
  compilationJob: CompilationJob;
  input: CompilerInput;
  output: CompilerOutput;
  solcBuild: {
    version: string;
  };
}

export interface KriptonioUploadConfig {
  name: string;
  contract: string;
  wallet: string | undefined;
  apiUrl: string;
  appUrl: string;
  accessToken: string;
  blockchain: string;
}
