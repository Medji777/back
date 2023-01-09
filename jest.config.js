/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': ['<rootDir>/$1'],
    '^@src/(.*)$': ['<rootDir>/src/$1'],
    '^@repositories/(.*)$': ['<rootDir>/src/repositories/$1'],
    '^@routers/(.*)$': ['<rootDir>/src/routers/$1'],
    '^@utils/(.*)$': ['<rootDir>/src/utils/$1'],
    '^@validations/(.*)$': ['<rootDir>/src/validations/$1'],
  },
};