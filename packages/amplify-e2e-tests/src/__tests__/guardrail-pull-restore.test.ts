import {
  createNewProjectDir,
  deleteProject,
  deleteProjectDir,
  initJSProjectWithProfile,
  getAppId,
  getTeamProviderInfo,
  gitCleanFdx,
  amplifyPull,
  gitChangedFiles,
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
    await initJSProjectWithProfile(projRoot, { disableAmplifyAppCreation: false });
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
    await gitCleanFdx(projRoot); // clear TPI
    await amplifyPull(projRoot, { emptyDir: false, appId, withRestore: true });

    const changedFiles = await gitChangedFiles(projRoot);
    expect(changedFiles).toMatchInlineSnapshot(`
      Array [
        ".gitignore",
        "amplify/README.md",
      ]
    `);
    const postCleanTpi = getTeamProviderInfo(projRoot);
    expect(postCleanTpi).toEqual(preCleanTpi);
  });
});
