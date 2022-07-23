import { KriptonioUploadConfig } from './types';

function getKey(key: keyof KriptonioUploadConfig, cliConfig: Partial<KriptonioUploadConfig>, hardhatConfig?: Partial<KriptonioUploadConfig>) {
  return cliConfig[key] || hardhatConfig?.[key];
}

function requireKey(key: keyof KriptonioUploadConfig, cliConfig: Partial<KriptonioUploadConfig>, hardhatConfig?: Partial<KriptonioUploadConfig>) {
  const value = getKey(key, cliConfig, hardhatConfig);
  if (!value) {
    throw new Error(`${key} empty. Please provide it via hardhat.config or cli argument`);
  }

  return value;
}

export function getConfig(cliConfig: KriptonioUploadConfig, hardhatConfig?: Partial<KriptonioUploadConfig>): KriptonioUploadConfig {
  return {
    accessToken: requireKey('accessToken', cliConfig, hardhatConfig),
    apiUrl: requireKey('apiUrl', cliConfig, hardhatConfig) || 'https://api.kriptonio.com/v1/smart-contracts/standard-json',
    appUrl: requireKey('appUrl', cliConfig, hardhatConfig) || 'https://app.kriptonio.com',
    blockchain: requireKey('blockchain', cliConfig, hardhatConfig),
    contract: requireKey('contract', cliConfig, hardhatConfig),
    name: getKey('name', cliConfig, hardhatConfig) || requireKey('contract', cliConfig, hardhatConfig),
    wallet: getKey('wallet', cliConfig, hardhatConfig),
  };
}
