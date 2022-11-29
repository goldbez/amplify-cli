import { comands_info } from './commands-info';
import chalk from 'chalk';

export function getCommandsFromInput(input) {
  // let args = input.argv;
  // var i;
  // for (i = 0; i < args.length; i++) {
  //   if (args[i].includes('amplify')) {
  //     break;
  //   }
  // }
  // var potential_commands = args.splice(i + 1);
  // potential_commands = potential_commands.filter(item => !item.includes('-'));
  // let return_val = {command: potential_commands.length > 0 ? potential_commands[0] : '',
  //                   subCommand: potential_commands.length > 1 ? potential_commands[1] : ''};


  let return_val = parseHelpCommands(input);


  return return_val;
}

export function parseHelpCommands(input) {
    var specifiedCommands = {command: "", subCommand: ""};
    let acceptableSubcommands = ["project", "geo"]; // TODO add all acceptable subcommands. Can automate this from JSON of commands.
    let hasSubcommands = input.subCommands! && Array.isArray(input.subCommands) && input.subCommands.length >= 1; // check if subcommands exist
    if (hasSubcommands) {
      specifiedCommands = {command: input.subCommands[0], subCommand: ""}; // if just 1 subcommand, set that as command
      if (input.subCommands.length == 1) {
        if (input.plugin! && input.plugin !== "core") { // check if there is a plugin
          specifiedCommands = {command: input.subCommands[0], subCommand: input.plugin};
        } else if (input.options!) { // check if subcommands are in options field
          let subcommands_in_options = acceptableSubcommands.filter(i => input.options.hasOwnProperty(i));
          if (subcommands_in_options! && subcommands_in_options.length == 1) {
            specifiedCommands = {command: input.subCommands[0], subCommand: subcommands_in_options[0]};
          }
        }
      } else if (input.subCommands.length == 2) {
        specifiedCommands = {command: input.subCommands[0], subCommand: input.subCommands[1]};
      }
    }
    return specifiedCommands;
}

export function printGenericHelp(default_num_tabs=1, extra_tab_length_threshold=5) {
    console.log("\n");
    console.log("Build full-stack web and mobile apps in hours. Easy to start, easy to scale.");
    console.log("\n");

    console.log(chalk.blue.bold('USAGE'));
    console.log("  " + "amplify <command> <subcommand> [flags]");
    console.log("\n");

    console.log(chalk.blue.bold('COMMANDS'));
    Object.keys(comands_info).forEach(function(item) {
        var line = "  " + item;
        for (var i = 0; i < default_num_tabs + (item.length > extra_tab_length_threshold ? 0 : 1); i++) {
          line += '\t';
        }
        line += comands_info[item]['commandDescription'];
        console.log(line);
    });
    console.log("\n");

    console.log(chalk.blue.bold('FLAGS'));
    console.log("  " + "-h" + "\t\t" + "Show help for a command.");
    console.log("\n");

    console.log(chalk.blue.bold('LEARN MORE'));
    console.log("  " + "Visit https://aws.amazon.com/amplify/");
    console.log("\n");
}

export function printCommandSpecificHelp(command, default_num_tabs=1, extra_tab_length_threshold=5) {
  if (!(command.toLocaleLowerCase() in comands_info)) {
    printGenericHelp(default_num_tabs, extra_tab_length_threshold);
    return;
  }

  console.log(chalk.blue.bold('USAGE'));
  console.log("  " + comands_info[command]['commandUsage']);
  console.log("\n");

  console.log(chalk.blue.bold('DESCRIPTION'));
  console.log("  " + comands_info[command]['commandDescription']);
  console.log("\n");

  if (Object.keys(comands_info[command]['subCommands']).length > 0) {
    console.log(chalk.blue.bold('SUBCOMMANDS'));
    Object.keys(comands_info[command]['subCommands']).forEach(function(item) {
      var line = "  " + item;
      for (var i = 0; i < default_num_tabs + (item.length > extra_tab_length_threshold ? 0 : 1); i++) {
        line += '\t';
      }
      line += comands_info[command]['subCommands'][item]['subCommandDescription'];
      console.log(line);
    });
    console.log("\n");
    console.log("  Use amplify " + command + " <subcommand> -h " + " to see subcommand-specific help." );
    console.log("\n");
  }

  if (Object.keys(comands_info[command]['commandFlags']).length > 0) {
    console.log(chalk.blue.bold('FLAGS'));
    Object.keys(comands_info[command]['commandFlags']).forEach(function(item, index) {
      let flag_object = comands_info[command]['commandFlags'][index];
      let has_short = flag_object['short'].length > 0;
      let has_long = flag_object['long'].length > 0;
      var line = "  ";
      if (has_short && has_long) {
        line += flag_object['short'] + " | " + flag_object['long'];
      } else if (has_short) {
        line += flag_object['short'];
      } else {
        line += flag_object['long'];
      }
      for (var i = 0; i < default_num_tabs + (flag_object.length > extra_tab_length_threshold ? 0 : 1); i++) {
        line += '\t';
      }
      line += flag_object['flagDescription'];
      console.log(line);
    });
    console.log("\n");
  }

  if (comands_info[command]['learnMoreLink'].length > 0) {
    console.log(chalk.blue.bold('LEARN MORE'));
    console.log("  " + comands_info[command]['learnMoreLink']);
    console.log("\n");
  }
}

export function printSubcommandSpecificHelp(command, subcommand, default_num_tabs=1, extra_tab_length_threshold=5) {
  if (!(command.toLocaleLowerCase() in comands_info)) {
    printGenericHelp(default_num_tabs, extra_tab_length_threshold);
    return;
  } else if (!(subcommand.toLocaleLowerCase() in comands_info[command]['subCommands'])) {
    printCommandSpecificHelp(command, default_num_tabs, extra_tab_length_threshold);
    return;
  }

  console.log(chalk.blue.bold('USAGE'));
  console.log("  " + comands_info[command]['subCommands'][subcommand]['subCommandUsage']);
  console.log("\n");

  console.log(chalk.blue.bold('DESCRIPTION'));
  console.log("  " + comands_info[command]['subCommands'][subcommand]['subCommandDescription']);
  console.log("\n");

  if (Object.keys(comands_info[command]['subCommands'][subcommand]['subCommandFlags']).length > 0) {
    console.log(chalk.blue.bold('FLAGS'));
    Object.keys(comands_info[command]['subCommands'][subcommand]['subCommandFlags']).forEach(function(item, index) {
      let flag_object = comands_info[command]['subCommands'][subcommand]['subCommandFlags'][index];
      let has_short = flag_object['short'].length > 0;
      let has_long = flag_object['long'].length > 0;
      var line = "  ";
      if (has_short && has_long) {
        line += flag_object['short'] + " | " + flag_object['long'];
      } else if (has_short) {
        line += flag_object['short'];
      } else {
        line += flag_object['long'];
      }
      for (var i = 0; i < default_num_tabs + (flag_object.length > extra_tab_length_threshold ? 0 : 1); i++) {
        line += '\t';
      }
      line += flag_object['flagDescription'];
      console.log(line);
    });
    console.log("\n");
  }

  if (comands_info[command]['subCommands'][subcommand]['learnMoreLink'].length > 0) {
    console.log(chalk.blue.bold('LEARN MORE'));
    console.log("  " + comands_info[command]['subCommands'][subcommand]['learnMoreLink']);
    console.log("\n");
  }
}