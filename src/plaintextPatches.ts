export default [
  {
    find: "flashKey",
    replacements: [
      {
        match: /([\w$]+\.[\w$]+\([\w$]+,\{[\w$]+:\(\)=>[\w$]+)(\}\))/,
        replace: `$1,ChannelMessage: () => channelMessage$2`,
      },
      {
        match:
          /([^]*)(function (\w+)\(\w+\){[^]*?.*message.*channel.*flashKey[^]*?bg-flash-[^]*?})/,
        replace: `$1$2;const channelMessage=$3;`,
      },
    ],
  },
];
