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
];
