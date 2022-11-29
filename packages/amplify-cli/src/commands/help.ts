import { $TSContext } from 'amplify-cli-core';
import { showAllHelp } from '../extensions/amplify-helpers/show-all-help';
import { getCommandsFromInput } from '../extensions/amplify-helpers/show-specific-help';
import { printGenericHelp, printCommandSpecificHelp, printSubcommandSpecificHelp } from '../extensions/amplify-helpers/show-specific-help';

/**
 * displays amplify help menu
 */
export const run = async (context: $TSContext): Promise<void> => {
  let specifiedCommands = getCommandsFromInput(context.input);
  if (specifiedCommands['command'].length !== 0 && specifiedCommands['subCommand'].length !== 0) {
    printSubcommandSpecificHelp(specifiedCommands['command'], specifiedCommands['subCommand']);
  } else if (specifiedCommands['command'].length !== 0) {
    printCommandSpecificHelp(specifiedCommands['command']);
  } else {
    printGenericHelp();
  }
};

