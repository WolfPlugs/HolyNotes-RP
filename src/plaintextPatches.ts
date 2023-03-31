export default [
  {
    find: "flashKey",
    replacements: [
      {
        match: /(.\..\(.,{[\w$]+:\(\)=>[\w$]+)(}\))/,
        replace: `$1,ChannelMessage:()=>channelMessage$2`,
      },
      {
        match:
          /[^]*const channelMessage=[\w]+;|([^]*)(function (\w+)\(.\){[^]*?message.*channel.*flashKey[^]*?bg-flash-[^]*?})/,
        replace: (entireOrig: string, perfix: string, func: string, funcName: string): string => {
          if (!perfix || !func || !funcName) return entireOrig;
          return `${perfix}${func};const channelMessage=${funcName};`;
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
