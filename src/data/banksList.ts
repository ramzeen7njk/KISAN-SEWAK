export interface Bank {
  id: string;
  name: string;
  ifscPrefix: string;
}

export const INDIAN_BANKS: Bank[] = [
  { id: "sbi", name: "State Bank of India (SBI)", ifscPrefix: "SBIN" },
  { id: "iob", name: "Indian Overseas Bank (IOB)", ifscPrefix: "IOBA" },
  { id: "canara", name: "Canara Bank", ifscPrefix: "CNRB" },
  { id: "pnb", name: "Punjab National Bank", ifscPrefix: "PUNB" },
  { id: "bob", name: "Bank of Baroda", ifscPrefix: "BARB" },
  { id: "hdfc", name: "HDFC Bank", ifscPrefix: "HDFC" },
  { id: "icici", name: "ICICI Bank", ifscPrefix: "ICIC" },
  { id: "axis", name: "Axis Bank", ifscPrefix: "UTIB" },
  { id: "idbi", name: "IDBI Bank", ifscPrefix: "IBKL" },
  { id: "union", name: "Union Bank of India", ifscPrefix: "UBIN" },
  { id: "boi", name: "Bank of India", ifscPrefix: "BKID" },
  { id: "cbi", name: "Central Bank of India", ifscPrefix: "CBIN" },
  { id: "indian", name: "Indian Bank", ifscPrefix: "IDIB" },
  { id: "kotak", name: "Kotak Mahindra Bank", ifscPrefix: "KKBK" },
  { id: "yes", name: "Yes Bank", ifscPrefix: "YESB" },
  { id: "federal", name: "Federal Bank", ifscPrefix: "FDRL" },
  { id: "indusind", name: "IndusInd Bank", ifscPrefix: "INDB" },
  { id: "rbl", name: "RBL Bank", ifscPrefix: "RATN" },
  { id: "karnataka", name: "Karnataka Bank", ifscPrefix: "KARB" },
  { id: "south", name: "South Indian Bank", ifscPrefix: "SIBL" },
  { id: "bandhan", name: "Bandhan Bank", ifscPrefix: "BDBL" },
  { id: "dcb", name: "DCB Bank", ifscPrefix: "DCBL" },
  { id: "csb", name: "CSB Bank", ifscPrefix: "CSBK" },
  { id: "kvb", name: "Karur Vysya Bank", ifscPrefix: "KVBL" },
  { id: "tmb", name: "Tamilnad Mercantile Bank", ifscPrefix: "TMBL" },
  { id: "city", name: "City Union Bank", ifscPrefix: "CIUB" },
  { id: "dhanlaxmi", name: "Dhanlaxmi Bank", ifscPrefix: "DLXB" },
  { id: "jkb", name: "Jammu & Kashmir Bank", ifscPrefix: "JAKA" },
  { id: "nainital", name: "Nainital Bank", ifscPrefix: "NTBL" },
  { id: "idfc", name: "IDFC First Bank", ifscPrefix: "IDFB" }
];