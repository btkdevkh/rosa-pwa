const stripSpaceLowerSTR = (str: string | null) => {
  return str?.replace(/ /i, "-").replace(/[,.*]/gi, "")?.toLowerCase();
};

export default stripSpaceLowerSTR;
