export default [
  {
    find: "flashKey",
    replacements: [
      {
        match: /[^]*function (\w+)\(.\){[^]*?message.*channel.*flashKey[^]*?bg-flash-[^]*?}/,
        replace: (match: string, funcName: string): string => {
          return (
            `${match}` +
            "function holyNotesExists(){" +
            'if (window.replugged.plugins.getExports("dev.wolfplugs.HolyNotes")) {' +
            `window.replugged.plugins.getExports("dev.wolfplugs.HolyNotes")?.addCustomExport("ChannelMessage", ${funcName});` +
            "} else {" +
            "setTimeout(holyNotesExists, 1000)" +
            "}" +
            "};" +
            "holyNotesExists();"
          );
        },
      },
    ],
  },
  // {
  //   find: 'navId:"message"',
  //   replacements: [
  //     {
  //       match:
  //         /(function \w+\((\w+)\){[\s]+var \w+=\w+.message[\s\S]+onSelect:\w+,children:)(\[.+\])}/g,
  //       replace: `$1(window.replugged.plugins.getExports('dev.wolfplugs.HolyNotes')?.noteMenu?.($2,$3)||$3)}`,
  //     },
  //   ],
  // }
];
