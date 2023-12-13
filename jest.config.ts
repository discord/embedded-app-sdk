import type {Config} from '@jest/types';

export default (): Config.InitialOptions => {
  return {
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.test.(ts|js)'],
  };
};
