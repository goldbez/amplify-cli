import {
  createNewProjectDir,
  deleteProject,
  deleteProjectDir,
  initJSProjectWithProfile,
  getAppId,
  getTeamProviderInfo,
  gitInit,
  gitCleanFdx,
  amplifyPull,
  generateRandomShortId,
  addFunction,
  amplifyPushAuth,
} from '@aws-amplify/amplify-e2e-core';

describe('ensure pull with restore flag repopulates TPI', () => {
  let projRoot: string;
  beforeEach(async () => {
    projRoot = await createNewProjectDir('upload-delete-parameters-test');
  });

  afterEach(async () => {
    await deleteProject(projRoot);
    deleteProjectDir(projRoot);
  });

  it('deleting TPI and then pulling with --restore should repopulate TPI', async () => {
    await gitInit(projRoot);
    const envName = 'firstenv';
    await initJSProjectWithProfile(projRoot, { disableAmplifyAppCreation: false, envName });
    const appId = getAppId(projRoot);

    const envVariableName = 'envVariableName';
    const envVariableValue = 'envVariableValue';
    const fnName = `parameterstestfn${generateRandomShortId()}`;
    await addFunction(
      projRoot,
      {
        name: fnName,
        functionTemplate: 'Hello World',
        environmentVariables: {
          key: envVariableName,
          value: envVariableValue,
        },
      },
      'nodejs',
    );
    await amplifyPushAuth(projRoot);
    const preCleanTpi = getTeamProviderInfo(projRoot);
    // await gitCommitAll(projRoot);
    await gitCleanFdx(projRoot); // clear TPI
    await amplifyPull(projRoot, { appId, envName, withRestore: true, emptyDir: true });
    const postCleanTpi = getTeamProviderInfo(projRoot);
    expect(postCleanTpi).toEqual(preCleanTpi);
  });
});
