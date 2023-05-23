export default [
  {
    find: "flashKey",
    replacements: [
      {
        match: /[^]*function (\w+)\(.\){[^]*?message.*channel.*flashKey[^]*?bg-flash-[^]*?}/,
        replace: (entireMatch: string, funcName: string): string => {
          return (
            `${entireMatch}` +
            `function HolyNoteExist(){` +
            `if (replugged.plugins.getExports("dev.wolfplugs.HolyNotes")){` +
            `replugged.plugins.getExports("dev.wolfplugs.HolyNotes")?.addCustomExport("ChannelMessage", ${funcName});` +
            `}else{` +
            `setTimeout(HolyNoteExist, 1000)` +
            `}` +
            `};` +
            `HolyNoteExist();`
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
