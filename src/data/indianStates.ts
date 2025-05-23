export interface State {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
}

export const INDIAN_STATES: State[] = [
  { id: "AP", name: "Andhra Pradesh" },
  { id: "AR", name: "Arunachal Pradesh" },
  { id: "AS", name: "Assam" },
  { id: "BR", name: "Bihar" },
  { id: "CG", name: "Chhattisgarh" },
  { id: "GA", name: "Goa" },
  { id: "GJ", name: "Gujarat" },
  { id: "HR", name: "Haryana" },
  { id: "HP", name: "Himachal Pradesh" },
  { id: "JH", name: "Jharkhand" },
  { id: "KA", name: "Karnataka" },
  { id: "KL", name: "Kerala" },
  { id: "MP", name: "Madhya Pradesh" },
  { id: "MH", name: "Maharashtra" },
  { id: "MN", name: "Manipur" },
  { id: "ML", name: "Meghalaya" },
  { id: "MZ", name: "Mizoram" },
  { id: "NL", name: "Nagaland" },
  { id: "OD", name: "Odisha" },
  { id: "PB", name: "Punjab" },
  { id: "RJ", name: "Rajasthan" },
  { id: "SK", name: "Sikkim" },
  { id: "TN", name: "Tamil Nadu" },
  { id: "TS", name: "Telangana" },
  { id: "TR", name: "Tripura" },
  { id: "UP", name: "Uttar Pradesh" },
  { id: "UK", name: "Uttarakhand" },
  { id: "WB", name: "West Bengal" },
  { id: "JK", name: "Jammu & Kashmir" },
  { id: "LA", name: "Ladakh" }
];

export const INDIAN_CITIES: City[] = [
  // Andhra Pradesh
  { id: "AP01", name: "Visakhapatnam", stateId: "AP" },
  { id: "AP02", name: "Vijayawada", stateId: "AP" },
  { id: "AP03", name: "Guntur", stateId: "AP" },
  { id: "AP04", name: "Nellore", stateId: "AP" },
  { id: "AP05", name: "Kurnool", stateId: "AP" },
  { id: "AP06", name: "Kakinada", stateId: "AP" },
  { id: "AP07", name: "Tirupati", stateId: "AP" },
  { id: "AP08", name: "Anantapur", stateId: "AP" },
  { id: "AP09", name: "Kadapa", stateId: "AP" },
  { id: "AP10", name: "Rajahmundry", stateId: "AP" },
  { id: "AP11", name: "Eluru", stateId: "AP" },
  { id: "AP12", name: "Ongole", stateId: "AP" },
  { id: "AP13", name: "Chittoor", stateId: "AP" },
  { id: "AP14", name: "Machilipatnam", stateId: "AP" },
  { id: "AP15", name: "Adoni", stateId: "AP" },
  { id: "AP16", name: "Proddatur", stateId: "AP" },
  { id: "AP17", name: "Hindupur", stateId: "AP" },
  { id: "AP18", name: "Bhimavaram", stateId: "AP" },
  { id: "AP19", name: "Madanapalle", stateId: "AP" },
  { id: "AP20", name: "Guntakal", stateId: "AP" },
  
  // Arunachal Pradesh
  { id: "AR01", name: "Itanagar", stateId: "AR" },
  { id: "AR02", name: "Naharlagun", stateId: "AR" },
  { id: "AR03", name: "Pasighat", stateId: "AR" },
  { id: "AR04", name: "Tawang", stateId: "AR" },
  { id: "AR05", name: "Ziro", stateId: "AR" },
  { id: "AR06", name: "Bomdila", stateId: "AR" },
  { id: "AR07", name: "Aalo (Along)", stateId: "AR" },
  { id: "AR08", name: "Tezu", stateId: "AR" },
  { id: "AR09", name: "Khonsa", stateId: "AR" },
  { id: "AR10", name: "Roing", stateId: "AR" },
  { id: "AR11", name: "Anini", stateId: "AR" },
  { id: "AR12", name: "Daporijo", stateId: "AR" },
  { id: "AR13", name: "Seppa", stateId: "AR" },
  { id: "AR14", name: "Namsai", stateId: "AR" },
  { id: "AR15", name: "Yingkiong", stateId: "AR" },
  { id: "AR16", name: "Changlang", stateId: "AR" },
  { id: "AR17", name: "Hawai", stateId: "AR" },
  { id: "AR18", name: "Longding", stateId: "AR" },
  { id: "AR19", name: "Basar", stateId: "AR" },
  { id: "AR20", name: "Deomali", stateId: "AR" },
  
  // Assam
  { id: "AS01", name: "Guwahati", stateId: "AS" },
  { id: "AS02", name: "Silchar", stateId: "AS" },
  { id: "AS03", name: "Dibrugarh", stateId: "AS" },
  { id: "AS04", name: "Jorhat", stateId: "AS" },
  { id: "AS05", name: "Nagaon", stateId: "AS" },
  { id: "AS06", name: "Tinsukia", stateId: "AS" },
  { id: "AS07", name: "Tezpur", stateId: "AS" },
  { id: "AS08", name: "Karimganj", stateId: "AS" },
  { id: "AS09", name: "Goalpara", stateId: "AS" },
  { id: "AS10", name: "Diphu", stateId: "AS" },
  { id: "AS11", name: "Bongaigaon", stateId: "AS" },
  { id: "AS12", name: "North Lakhimpur", stateId: "AS" },
  { id: "AS13", name: "Dhubri", stateId: "AS" },
  { id: "AS14", name: "Sibsagar", stateId: "AS" },
  { id: "AS15", name: "Barpeta", stateId: "AS" },
  { id: "AS16", name: "Kokrajhar", stateId: "AS" },
  { id: "AS17", name: "Golaghat", stateId: "AS" },
  { id: "AS18", name: "Hamren", stateId: "AS" },
  { id: "AS19", name: "Haflong", stateId: "AS" },
  { id: "AS20", name: "Mangaldoi", stateId: "AS" },
  
  // Bihar
  { id: "BR01", name: "Patna", stateId: "BR" },
  { id: "BR02", name: "Gaya", stateId: "BR" },
  { id: "BR03", name: "Muzaffarpur", stateId: "BR" },
  { id: "BR04", name: "Bhagalpur", stateId: "BR" },
  { id: "BR05", name: "Darbhanga", stateId: "BR" },
  { id: "BR06", name: "Purnia", stateId: "BR" },
  { id: "BR07", name: "Arrah", stateId: "BR" },
  { id: "BR08", name: "Bihar Sharif", stateId: "BR" },
  { id: "BR09", name: "Begusarai", stateId: "BR" },
  { id: "BR10", name: "Katihar", stateId: "BR" },
  { id: "BR11", name: "Munger", stateId: "BR" },
  { id: "BR12", name: "Chapra", stateId: "BR" },
  { id: "BR13", name: "Saharsa", stateId: "BR" },
  { id: "BR14", name: "Hajipur", stateId: "BR" },
  { id: "BR15", name: "Sasaram", stateId: "BR" },
  { id: "BR16", name: "Samastipur", stateId: "BR" },
  { id: "BR17", name: "Bettiah", stateId: "BR" },
  { id: "BR18", name: "Dehri", stateId: "BR" },
  { id: "BR19", name: "Motihari", stateId: "BR" },
  { id: "BR20", name: "Siwan", stateId: "BR" },
  
  // Chhattisgarh
  { id: "CG01", name: "Raipur", stateId: "CG" },
  { id: "CG02", name: "Bhilai", stateId: "CG" },
  { id: "CG03", name: "Bilaspur", stateId: "CG" },
  { id: "CG04", name: "Korba", stateId: "CG" },
  { id: "CG05", name: "Durg", stateId: "CG" },
  { id: "CG06", name: "Rajnandgaon", stateId: "CG" },
  { id: "CG07", name: "Jagdalpur", stateId: "CG" },
  { id: "CG08", name: "Ambikapur", stateId: "CG" },
  { id: "CG09", name: "Chirmiri", stateId: "CG" },
  { id: "CG10", name: "Dhamtari", stateId: "CG" },
  { id: "CG11", name: "Raigarh", stateId: "CG" },
  { id: "CG12", name: "Mahasamund", stateId: "CG" },
  { id: "CG13", name: "Kanker", stateId: "CG" },
  { id: "CG14", name: "Dongargarh", stateId: "CG" },
  { id: "CG15", name: "Kondagaon", stateId: "CG" },
  { id: "CG16", name: "Bemetara", stateId: "CG" },
  { id: "CG17", name: "Narayanpur", stateId: "CG" },
  { id: "CG18", name: "Bijapur", stateId: "CG" },
  { id: "CG19", name: "Sukma", stateId: "CG" },
  { id: "CG20", name: "Kawardha", stateId: "CG" },
  
  // Gujarat
  { id: "GJ01", name: "Ahmedabad", stateId: "GJ" },
  { id: "GJ02", name: "Surat", stateId: "GJ" },
  { id: "GJ03", name: "Vadodara", stateId: "GJ" },
  { id: "GJ04", name: "Rajkot", stateId: "GJ" },
  { id: "GJ05", name: "Bhavnagar", stateId: "GJ" },
  { id: "GJ06", name: "Jamnagar", stateId: "GJ" },
  { id: "GJ07", name: "Junagadh", stateId: "GJ" },
  { id: "GJ08", name: "Gandhinagar", stateId: "GJ" },
  { id: "GJ09", name: "Gandhidham", stateId: "GJ" },
  { id: "GJ10", name: "Anand", stateId: "GJ" },
  { id: "GJ11", name: "Navsari", stateId: "GJ" },
  { id: "GJ12", name: "Morbi", stateId: "GJ" },
  { id: "GJ13", name: "Nadiad", stateId: "GJ" },
  { id: "GJ14", name: "Surendranagar", stateId: "GJ" },
  { id: "GJ15", name: "Bharuch", stateId: "GJ" },
  { id: "GJ16", name: "Mehsana", stateId: "GJ" },
  { id: "GJ17", name: "Bhuj", stateId: "GJ" },
  { id: "GJ18", name: "Porbandar", stateId: "GJ" },
  { id: "GJ19", name: "Palanpur", stateId: "GJ" },
  { id: "GJ20", name: "Valsad", stateId: "GJ" },
  
  // Haryana
  { id: "HR01", name: "Faridabad", stateId: "HR" },
  { id: "HR02", name: "Gurugram", stateId: "HR" },
  { id: "HR03", name: "Panipat", stateId: "HR" },
  { id: "HR04", name: "Ambala", stateId: "HR" },
  { id: "HR05", name: "Yamunanagar", stateId: "HR" },
  { id: "HR06", name: "Rohtak", stateId: "HR" },
  { id: "HR07", name: "Hisar", stateId: "HR" },
  { id: "HR08", name: "Karnal", stateId: "HR" },
  { id: "HR09", name: "Sonipat", stateId: "HR" },
  { id: "HR10", name: "Panchkula", stateId: "HR" },
  { id: "HR11", name: "Bhiwani", stateId: "HR" },
  { id: "HR12", name: "Sirsa", stateId: "HR" },
  { id: "HR13", name: "Bahadurgarh", stateId: "HR" },
  { id: "HR14", name: "Jind", stateId: "HR" },
  { id: "HR15", name: "Thanesar", stateId: "HR" },
  { id: "HR16", name: "Kaithal", stateId: "HR" },
  { id: "HR17", name: "Rewari", stateId: "HR" },
  { id: "HR18", name: "Fatehabad", stateId: "HR" },
  { id: "HR19", name: "Palwal", stateId: "HR" },
  { id: "HR20", name: "Narnaul", stateId: "HR" },
  
  // Himachal Pradesh
  { id: "HP01", name: "Shimla", stateId: "HP" },
  { id: "HP02", name: "Mandi", stateId: "HP" },
  { id: "HP03", name: "Dharamshala", stateId: "HP" },
  { id: "HP04", name: "Solan", stateId: "HP" },
  { id: "HP05", name: "Kullu", stateId: "HP" },
  { id: "HP06", name: "Bilaspur", stateId: "HP" },
  { id: "HP07", name: "Hamirpur", stateId: "HP" },
  { id: "HP08", name: "Una", stateId: "HP" },
  { id: "HP09", name: "Nahan", stateId: "HP" },
  { id: "HP10", name: "Palampur", stateId: "HP" },
  { id: "HP11", name: "Chamba", stateId: "HP" },
  { id: "HP12", name: "Kangra", stateId: "HP" },
  { id: "HP13", name: "Nurpur", stateId: "HP" },
  { id: "HP14", name: "Rampur", stateId: "HP" },
  { id: "HP15", name: "Sundernagar", stateId: "HP" },
  { id: "HP16", name: "Dalhousie", stateId: "HP" },
  { id: "HP17", name: "Manali", stateId: "HP" },
  { id: "HP18", name: "Kasauli", stateId: "HP" },
  { id: "HP19", name: "Baddi", stateId: "HP" },
  { id: "HP20", name: "Parwanoo", stateId: "HP" },
  
  // Jharkhand
  { id: "JH01", name: "Ranchi", stateId: "JH" },
  { id: "JH02", name: "Jamshedpur", stateId: "JH" },
  { id: "JH03", name: "Dhanbad", stateId: "JH" },
  { id: "JH04", name: "Bokaro", stateId: "JH" },
  { id: "JH05", name: "Hazaribagh", stateId: "JH" },
  { id: "JH06", name: "Deoghar", stateId: "JH" },
  { id: "JH07", name: "Giridih", stateId: "JH" },
  { id: "JH08", name: "Ramgarh", stateId: "JH" },
  { id: "JH09", name: "Medininagar", stateId: "JH" },
  { id: "JH10", name: "Phusro", stateId: "JH" },
  { id: "JH11", name: "Dumka", stateId: "JH" },
  { id: "JH12", name: "Chaibasa", stateId: "JH" },
  { id: "JH13", name: "Gumla", stateId: "JH" },
  { id: "JH14", name: "Chatra", stateId: "JH" },
  { id: "JH15", name: "Godda", stateId: "JH" },
  { id: "JH16", name: "Sahibganj", stateId: "JH" },
  { id: "JH17", name: "Lohardaga", stateId: "JH" },
  { id: "JH18", name: "Pakur", stateId: "JH" },
  { id: "JH19", name: "Garhwa", stateId: "JH" },
  { id: "JH20", name: "Simdega", stateId: "JH" },
  
  // Karnataka
  { id: "KA01", name: "Bengaluru", stateId: "KA" },
  { id: "KA02", name: "Mysuru", stateId: "KA" },
  { id: "KA03", name: "Hubballi", stateId: "KA" },
  { id: "KA04", name: "Mangaluru", stateId: "KA" },
  { id: "KA05", name: "Belagavi", stateId: "KA" },
  { id: "KA06", name: "Ballari", stateId: "KA" },
  { id: "KA07", name: "Vijayapura", stateId: "KA" },
  { id: "KA08", name: "Kalaburagi", stateId: "KA" },
  { id: "KA09", name: "Davanagere", stateId: "KA" },
  { id: "KA10", name: "Tumakuru", stateId: "KA" },
  { id: "KA11", name: "Shivamogga", stateId: "KA" },
  { id: "KA12", name: "Raichur", stateId: "KA" },
  { id: "KA13", name: "Bidar", stateId: "KA" },
  { id: "KA14", name: "Hassan", stateId: "KA" },
  { id: "KA15", name: "Udupi", stateId: "KA" },
  { id: "KA16", name: "Dharwad", stateId: "KA" },
  { id: "KA17", name: "Chitradurga", stateId: "KA" },
  { id: "KA18", name: "Bagalkot", stateId: "KA" },
  { id: "KA19", name: "Gadag", stateId: "KA" },
  { id: "KA20", name: "Mandya", stateId: "KA" },
  
  // Kerala
  { id: "KL01", name: "Thiruvananthapuram", stateId: "KL" },
  { id: "KL02", name: "Kochi", stateId: "KL" },
  { id: "KL03", name: "Kozhikode", stateId: "KL" },
  { id: "KL04", name: "Thrissur", stateId: "KL" },
  { id: "KL05", name: "Kollam", stateId: "KL" },
  { id: "KL06", name: "Alappuzha", stateId: "KL" },
  { id: "KL07", name: "Palakkad", stateId: "KL" },
  { id: "KL08", name: "Kannur", stateId: "KL" },
  { id: "KL09", name: "Kottayam", stateId: "KL" },
  { id: "KL10", name: "Malappuram", stateId: "KL" },
  { id: "KL11", name: "Kasaragod", stateId: "KL" },
  { id: "KL12", name: "Pathanamthitta", stateId: "KL" },
  { id: "KL13", name: "Thalassery", stateId: "KL" },
  { id: "KL14", name: "Ponnani", stateId: "KL" },
  { id: "KL15", name: "Vatakara", stateId: "KL" },
  { id: "KL16", name: "Neyyattinkara", stateId: "KL" },
  { id: "KL17", name: "Guruvayur", stateId: "KL" },
  { id: "KL18", name: "Changanassery", stateId: "KL" },
  { id: "KL19", name: "Perinthalmanna", stateId: "KL" },
  { id: "KL20", name: "Chalakudy", stateId: "KL" },
  
  // Madhya Pradesh
  { id: "MP01", name: "Bhopal", stateId: "MP" },
  { id: "MP02", name: "Indore", stateId: "MP" },
  { id: "MP03", name: "Jabalpur", stateId: "MP" },
  { id: "MP04", name: "Gwalior", stateId: "MP" },
  { id: "MP05", name: "Ujjain", stateId: "MP" },
  { id: "MP06", name: "Sagar", stateId: "MP" },
  { id: "MP07", name: "Dewas", stateId: "MP" },
  { id: "MP08", name: "Satna", stateId: "MP" },
  { id: "MP09", name: "Ratlam", stateId: "MP" },
  { id: "MP10", name: "Rewa", stateId: "MP" },
  { id: "MP11", name: "Murwara (Katni)", stateId: "MP" },
  { id: "MP12", name: "Singrauli", stateId: "MP" },
  { id: "MP13", name: "Burhanpur", stateId: "MP" },
  { id: "MP14", name: "Khandwa", stateId: "MP" },
  { id: "MP15", name: "Morena", stateId: "MP" },
  { id: "MP16", name: "Bhind", stateId: "MP" },
  { id: "MP17", name: "Chhindwara", stateId: "MP" },
  { id: "MP18", name: "Guna", stateId: "MP" },
  { id: "MP19", name: "Shivpuri", stateId: "MP" },
  { id: "MP20", name: "Vidisha", stateId: "MP" },
  
  // Maharashtra
  { id: "MH01", name: "Mumbai", stateId: "MH" },
  { id: "MH02", name: "Pune", stateId: "MH" },
  { id: "MH03", name: "Nagpur", stateId: "MH" },
  { id: "MH04", name: "Nashik", stateId: "MH" },
  { id: "MH05", name: "Aurangabad", stateId: "MH" },
  { id: "MH06", name: "Solapur", stateId: "MH" },
  { id: "MH07", name: "Kalyan-Dombivli", stateId: "MH" },
  { id: "MH08", name: "Thane", stateId: "MH" },
  { id: "MH09", name: "Navi Mumbai", stateId: "MH" },
  { id: "MH10", name: "Amravati", stateId: "MH" },
  { id: "MH11", name: "Kolhapur", stateId: "MH" },
  { id: "MH12", name: "Ulhasnagar", stateId: "MH" },
  { id: "MH13", name: "Sangli", stateId: "MH" },
  { id: "MH14", name: "Malegaon", stateId: "MH" },
  { id: "MH15", name: "Jalgaon", stateId: "MH" },
  { id: "MH16", name: "Akola", stateId: "MH" },
  { id: "MH17", name: "Latur", stateId: "MH" },
  { id: "MH18", name: "Dhule", stateId: "MH" },
  { id: "MH19", name: "Ahmednagar", stateId: "MH" },
  { id: "MH20", name: "Chandrapur", stateId: "MH" },
  
  // Punjab
  { id: "PB01", name: "Ludhiana", stateId: "PB" },
  { id: "PB02", name: "Amritsar", stateId: "PB" },
  { id: "PB03", name: "Jalandhar", stateId: "PB" },
  { id: "PB04", name: "Patiala", stateId: "PB" },
  { id: "PB05", name: "Bathinda", stateId: "PB" },
  { id: "PB06", name: "Mohali", stateId: "PB" },
  { id: "PB07", name: "Hoshiarpur", stateId: "PB" },
  { id: "PB08", name: "Batala", stateId: "PB" },
  { id: "PB09", name: "Pathankot", stateId: "PB" },
  { id: "PB10", name: "Moga", stateId: "PB" },
  { id: "PB11", name: "Abohar", stateId: "PB" },
  { id: "PB12", name: "Malerkotla", stateId: "PB" },
  { id: "PB13", name: "Khanna", stateId: "PB" },
  { id: "PB14", name: "Muktsar", stateId: "PB" },
  { id: "PB15", name: "Barnala", stateId: "PB" },
  { id: "PB16", name: "Rajpura", stateId: "PB" },
  { id: "PB17", name: "Firozpur", stateId: "PB" },
  { id: "PB18", name: "Kapurthala", stateId: "PB" },
  { id: "PB19", name: "Faridkot", stateId: "PB" },
  { id: "PB20", name: "Sangrur", stateId: "PB" },
  
  // Rajasthan
  { id: "RJ01", name: "Jaipur", stateId: "RJ" },
  { id: "RJ02", name: "Jodhpur", stateId: "RJ" },
  { id: "RJ03", name: "Udaipur", stateId: "RJ" },
  { id: "RJ04", name: "Kota", stateId: "RJ" },
  { id: "RJ05", name: "Ajmer", stateId: "RJ" },
  { id: "RJ06", name: "Bikaner", stateId: "RJ" },
  { id: "RJ07", name: "Alwar", stateId: "RJ" },
  { id: "RJ08", name: "Bharatpur", stateId: "RJ" },
  { id: "RJ09", name: "Sikar", stateId: "RJ" },
  { id: "RJ10", name: "Pali", stateId: "RJ" },
  { id: "RJ11", name: "Sri Ganganagar", stateId: "RJ" },
  { id: "RJ12", name: "Bhilwara", stateId: "RJ" },
  { id: "RJ13", name: "Chittorgarh", stateId: "RJ" },
  { id: "RJ14", name: "Mount Abu", stateId: "RJ" },
  { id: "RJ15", name: "Kishangarh", stateId: "RJ" },
  { id: "RJ16", name: "Tonk", stateId: "RJ" },
  { id: "RJ17", name: "Beawar", stateId: "RJ" },
  { id: "RJ18", name: "Hanumangarh", stateId: "RJ" },
  { id: "RJ19", name: "Dhaulpur", stateId: "RJ" },
  { id: "RJ20", name: "Sawai Madhopur", stateId: "RJ" },
  
  // Tamil Nadu
  { id: "TN01", name: "Chennai", stateId: "TN" },
  { id: "TN02", name: "Coimbatore", stateId: "TN" },
  { id: "TN03", name: "Madurai", stateId: "TN" },
  { id: "TN04", name: "Salem", stateId: "TN" },
  { id: "TN05", name: "Tiruchirappalli", stateId: "TN" },
  { id: "TN06", name: "Tirunelveli", stateId: "TN" },
  { id: "TN07", name: "Tiruppur", stateId: "TN" },
  { id: "TN08", name: "Vellore", stateId: "TN" },
  { id: "TN09", name: "Erode", stateId: "TN" },
  { id: "TN10", name: "Thoothukkudi", stateId: "TN" },
  { id: "TN11", name: "Dindigul", stateId: "TN" },
  { id: "TN12", name: "Thanjavur", stateId: "TN" },
  { id: "TN13", name: "Ranipet", stateId: "TN" },
  { id: "TN14", name: "Sivakasi", stateId: "TN" },
  { id: "TN15", name: "Karur", stateId: "TN" },
  { id: "TN16", name: "Udhagamandalam", stateId: "TN" },
  { id: "TN17", name: "Hosur", stateId: "TN" },
  { id: "TN18", name: "Nagercoil", stateId: "TN" },
  { id: "TN19", name: "Kanchipuram", stateId: "TN" },
  { id: "TN20", name: "Cuddalore", stateId: "TN" },
  
  // Telangana
  { id: "TS01", name: "Hyderabad", stateId: "TS" },
  { id: "TS02", name: "Warangal", stateId: "TS" },
  { id: "TS03", name: "Nizamabad", stateId: "TS" },
  { id: "TS04", name: "Karimnagar", stateId: "TS" },
  { id: "TS05", name: "Khammam", stateId: "TS" },
  { id: "TS06", name: "Ramagundam", stateId: "TS" },
  { id: "TS07", name: "Secunderabad", stateId: "TS" },
  { id: "TS08", name: "Mahbubnagar", stateId: "TS" },
  { id: "TS09", name: "Nalgonda", stateId: "TS" },
  { id: "TS10", name: "Adilabad", stateId: "TS" },
  { id: "TS11", name: "Siddipet", stateId: "TS" },
  { id: "TS12", name: "Suryapet", stateId: "TS" },
  { id: "TS13", name: "Miryalaguda", stateId: "TS" },
  { id: "TS14", name: "Jagitial", stateId: "TS" },
  { id: "TS15", name: "Mancherial", stateId: "TS" },
  { id: "TS16", name: "Bodhan", stateId: "TS" },
  { id: "TS17", name: "Kothagudem", stateId: "TS" },
  { id: "TS18", name: "Sangareddy", stateId: "TS" },
  { id: "TS19", name: "Medak", stateId: "TS" },
  { id: "TS20", name: "Wanaparthy", stateId: "TS" },
  
  // Uttar Pradesh
  { id: "UP01", name: "Lucknow", stateId: "UP" },
  { id: "UP02", name: "Kanpur", stateId: "UP" },
  { id: "UP03", name: "Agra", stateId: "UP" },
  { id: "UP04", name: "Varanasi", stateId: "UP" },
  { id: "UP05", name: "Prayagraj", stateId: "UP" },
  { id: "UP06", name: "Ghaziabad", stateId: "UP" },
  { id: "UP07", name: "Meerut", stateId: "UP" },
  { id: "UP08", name: "Bareilly", stateId: "UP" },
  { id: "UP09", name: "Aligarh", stateId: "UP" },
  { id: "UP10", name: "Moradabad", stateId: "UP" },
  { id: "UP11", name: "Saharanpur", stateId: "UP" },
  { id: "UP12", name: "Gorakhpur", stateId: "UP" },
  { id: "UP13", name: "Noida", stateId: "UP" },
  { id: "UP14", name: "Firozabad", stateId: "UP" },
  { id: "UP15", name: "Jhansi", stateId: "UP" },
  { id: "UP16", name: "Muzaffarnagar", stateId: "UP" },
  { id: "UP17", name: "Mathura", stateId: "UP" },
  { id: "UP18", name: "Ayodhya", stateId: "UP" },
  { id: "UP19", name: "Rampur", stateId: "UP" },
  { id: "UP20", name: "Shahjahanpur", stateId: "UP" },
  
  // Uttarakhand
  { id: "UK01", name: "Dehradun", stateId: "UK" },
  { id: "UK02", name: "Haridwar", stateId: "UK" },
  { id: "UK03", name: "Roorkee", stateId: "UK" },
  { id: "UK04", name: "Haldwani", stateId: "UK" },
  { id: "UK05", name: "Rudrapur", stateId: "UK" },
  { id: "UK06", name: "Kashipur", stateId: "UK" },
  { id: "UK07", name: "Rishikesh", stateId: "UK" },
  { id: "UK08", name: "Pithoragarh", stateId: "UK" },
  { id: "UK09", name: "Ramnagar", stateId: "UK" },
  { id: "UK10", name: "Mussoorie", stateId: "UK" },
  { id: "UK11", name: "Almora", stateId: "UK" },
  { id: "UK12", name: "Nainital", stateId: "UK" },
  { id: "UK13", name: "Pauri", stateId: "UK" },
  { id: "UK14", name: "Kotdwar", stateId: "UK" },
  { id: "UK15", name: "Tehri", stateId: "UK" },
  { id: "UK16", name: "Champawat", stateId: "UK" },
  { id: "UK17", name: "Gopeshwar", stateId: "UK" },
  { id: "UK18", name: "Uttarkashi", stateId: "UK" },
  { id: "UK19", name: "Srinagar", stateId: "UK" },
  { id: "UK20", name: "Bageshwar", stateId: "UK" },
  
  // West Bengal
  { id: "WB01", name: "Kolkata", stateId: "WB" },
  { id: "WB02", name: "Howrah", stateId: "WB" },
  { id: "WB03", name: "Durgapur", stateId: "WB" },
  { id: "WB04", name: "Asansol", stateId: "WB" },
  { id: "WB05", name: "Siliguri", stateId: "WB" },
  { id: "WB06", name: "Bardhaman", stateId: "WB" },
  { id: "WB07", name: "Malda", stateId: "WB" },
  { id: "WB08", name: "Baharampur", stateId: "WB" },
  { id: "WB09", name: "Habra", stateId: "WB" },
  { id: "WB10", name: "Kharagpur", stateId: "WB" },
  { id: "WB11", name: "Shantipur", stateId: "WB" },
  { id: "WB12", name: "Dankuni", stateId: "WB" },
  { id: "WB13", name: "Jalpaiguri", stateId: "WB" },
  { id: "WB14", name: "Haldia", stateId: "WB" },
  { id: "WB15", name: "Raiganj", stateId: "WB" },
  { id: "WB16", name: "Krishnanagar", stateId: "WB" },
  { id: "WB17", name: "Nabadwip", stateId: "WB" },
  { id: "WB18", name: "Medinipur", stateId: "WB" },
  { id: "WB19", name: "Cooch Behar", stateId: "WB" },
  { id: "WB20", name: "Bankura", stateId: "WB" },

  // Manipur
  { id: "MN01", name: "Imphal", stateId: "MN" },
  { id: "MN02", name: "Thoubal", stateId: "MN" },
  { id: "MN03", name: "Kakching", stateId: "MN" },
  { id: "MN04", name: "Ukhrul", stateId: "MN" },
  { id: "MN05", name: "Chandel", stateId: "MN" },
  { id: "MN06", name: "Bishnupur", stateId: "MN" },
  { id: "MN07", name: "Churachandpur", stateId: "MN" },
  { id: "MN08", name: "Senapati", stateId: "MN" },
  { id: "MN09", name: "Jiribam", stateId: "MN" },
  { id: "MN10", name: "Moreh", stateId: "MN" },
  { id: "MN11", name: "Lilong", stateId: "MN" },
  { id: "MN12", name: "Mayang Imphal", stateId: "MN" },
  { id: "MN13", name: "Nambol", stateId: "MN" },
  { id: "MN14", name: "Moirang", stateId: "MN" },
  { id: "MN15", name: "Yairipok", stateId: "MN" },
  { id: "MN16", name: "Kangpokpi", stateId: "MN" },
  { id: "MN17", name: "Sugnu", stateId: "MN" },
  { id: "MN18", name: "Tamenglong", stateId: "MN" },
  { id: "MN19", name: "Pherzawl", stateId: "MN" },
  { id: "MN20", name: "Noney", stateId: "MN" },

  // Meghalaya
  { id: "ML01", name: "Shillong", stateId: "ML" },
  { id: "ML02", name: "Tura", stateId: "ML" },
  { id: "ML03", name: "Jowai", stateId: "ML" },
  { id: "ML04", name: "Nongstoin", stateId: "ML" },
  { id: "ML05", name: "Williamnagar", stateId: "ML" },
  { id: "ML06", name: "Baghmara", stateId: "ML" },
  { id: "ML07", name: "Resubelpara", stateId: "ML" },
  { id: "ML08", name: "Mairang", stateId: "ML" },
  { id: "ML09", name: "Cherrapunji", stateId: "ML" },
  { id: "ML10", name: "Mawlai", stateId: "ML" },
  { id: "ML11", name: "Nongpoh", stateId: "ML" },
  { id: "ML12", name: "Khliehriat", stateId: "ML" },
  { id: "ML13", name: "Mawkyrwat", stateId: "ML" },
  { id: "ML14", name: "Amlarem", stateId: "ML" },
  { id: "ML15", name: "Ampati", stateId: "ML" },
  { id: "ML16", name: "Mahendraganj", stateId: "ML" },
  { id: "ML17", name: "Dadengiri", stateId: "ML" },
  { id: "ML18", name: "Rongjeng", stateId: "ML" },
  { id: "ML19", name: "Mendipathar", stateId: "ML" },
  { id: "ML20", name: "Selsella", stateId: "ML" },

  // Mizoram
  { id: "MZ01", name: "Aizawl", stateId: "MZ" },
  { id: "MZ02", name: "Lunglei", stateId: "MZ" },
  { id: "MZ03", name: "Champhai", stateId: "MZ" },
  { id: "MZ04", name: "Kolasib", stateId: "MZ" },
  { id: "MZ05", name: "Serchhip", stateId: "MZ" },
  { id: "MZ06", name: "Siaha", stateId: "MZ" },
  { id: "MZ07", name: "Lawngtlai", stateId: "MZ" },
  { id: "MZ08", name: "Mamit", stateId: "MZ" },
  { id: "MZ09", name: "Saitual", stateId: "MZ" },
  { id: "MZ10", name: "Khawzawl", stateId: "MZ" },
  { id: "MZ11", name: "Zawlnuam", stateId: "MZ" },
  { id: "MZ12", name: "Bairabi", stateId: "MZ" },
  { id: "MZ13", name: "Vairengte", stateId: "MZ" },
  { id: "MZ14", name: "Thenzawl", stateId: "MZ" },
  { id: "MZ15", name: "North Vanlaiphai", stateId: "MZ" },
  { id: "MZ16", name: "Hnahthial", stateId: "MZ" },
  { id: "MZ17", name: "Khawhai", stateId: "MZ" },
  { id: "MZ18", name: "Biate", stateId: "MZ" },
  { id: "MZ19", name: "Darlawn", stateId: "MZ" },
  { id: "MZ20", name: "Lengpui", stateId: "MZ" },

  // Nagaland
  { id: "NL01", name: "Kohima", stateId: "NL" },
  { id: "NL02", name: "Dimapur", stateId: "NL" },
  { id: "NL03", name: "Mokokchung", stateId: "NL" },
  { id: "NL04", name: "Tuensang", stateId: "NL" },
  { id: "NL05", name: "Wokha", stateId: "NL" },
  { id: "NL06", name: "Zunheboto", stateId: "NL" },
  { id: "NL07", name: "Mon", stateId: "NL" },
  { id: "NL08", name: "Phek", stateId: "NL" },
  { id: "NL09", name: "Kiphire", stateId: "NL" },
  { id: "NL10", name: "Longleng", stateId: "NL" },
  { id: "NL11", name: "Peren", stateId: "NL" },
  { id: "NL12", name: "Chumukedima", stateId: "NL" },
  { id: "NL13", name: "Tseminyu", stateId: "NL" },
  { id: "NL14", name: "Changtongya", stateId: "NL" },
  { id: "NL15", name: "Mangkolemba", stateId: "NL" },
  { id: "NL16", name: "Tuli", stateId: "NL" },
  { id: "NL17", name: "Aghunato", stateId: "NL" },
  { id: "NL18", name: "Noklak", stateId: "NL" },
  { id: "NL19", name: "Meluri", stateId: "NL" },
  { id: "NL20", name: "Pfutsero", stateId: "NL" },

  // Odisha
  { id: "OD01", name: "Bhubaneswar", stateId: "OD" },
  { id: "OD02", name: "Cuttack", stateId: "OD" },
  { id: "OD03", name: "Rourkela", stateId: "OD" },
  { id: "OD04", name: "Berhampur", stateId: "OD" },
  { id: "OD05", name: "Sambalpur", stateId: "OD" },
  { id: "OD06", name: "Puri", stateId: "OD" },
  { id: "OD07", name: "Balasore", stateId: "OD" },
  { id: "OD08", name: "Bhadrak", stateId: "OD" },
  { id: "OD09", name: "Baripada", stateId: "OD" },
  { id: "OD10", name: "Jharsuguda", stateId: "OD" },
  { id: "OD11", name: "Jeypore", stateId: "OD" },
  { id: "OD12", name: "Rayagada", stateId: "OD" },
  { id: "OD13", name: "Paradip", stateId: "OD" },
  { id: "OD14", name: "Angul", stateId: "OD" },
  { id: "OD15", name: "Dhenkanal", stateId: "OD" },
  { id: "OD16", name: "Kendrapara", stateId: "OD" },
  { id: "OD17", name: "Barbil", stateId: "OD" },
  { id: "OD18", name: "Koraput", stateId: "OD" },
  { id: "OD19", name: "Bhawanipatna", stateId: "OD" },
  { id: "OD20", name: "Talcher", stateId: "OD" },

  // Sikkim
  { id: "SK01", name: "Gangtok", stateId: "SK" },
  { id: "SK02", name: "Namchi", stateId: "SK" },
  { id: "SK03", name: "Gyalshing", stateId: "SK" },
  { id: "SK04", name: "Mangan", stateId: "SK" },
  { id: "SK05", name: "Rangpo", stateId: "SK" },
  { id: "SK06", name: "Singtam", stateId: "SK" },
  { id: "SK07", name: "Jorethang", stateId: "SK" },
  { id: "SK08", name: "Nayabazar", stateId: "SK" },
  { id: "SK09", name: "Ravangla", stateId: "SK" },
  { id: "SK10", name: "Rongli", stateId: "SK" },
  { id: "SK11", name: "Soreng", stateId: "SK" },
  { id: "SK12", name: "Yuksom", stateId: "SK" },
  { id: "SK13", name: "Lachen", stateId: "SK" },
  { id: "SK14", name: "Lachung", stateId: "SK" },
  { id: "SK15", name: "Pelling", stateId: "SK" },
  { id: "SK16", name: "Rhenock", stateId: "SK" },
  { id: "SK17", name: "Pakyong", stateId: "SK" },
  { id: "SK18", name: "Majitar", stateId: "SK" },
  { id: "SK19", name: "Chungthang", stateId: "SK" },
  { id: "SK20", name: "Dikchu", stateId: "SK" },

  // Tripura
  { id: "TR01", name: "Agartala", stateId: "TR" },
  { id: "TR02", name: "Udaipur", stateId: "TR" },
  { id: "TR03", name: "Dharmanagar", stateId: "TR" },
  { id: "TR04", name: "Belonia", stateId: "TR" },
  { id: "TR05", name: "Kailashahar", stateId: "TR" },
  { id: "TR06", name: "Khowai", stateId: "TR" },
  { id: "TR07", name: "Ambassa", stateId: "TR" },
  { id: "TR08", name: "Kamalpur", stateId: "TR" },
  { id: "TR09", name: "Bishalgarh", stateId: "TR" },
  { id: "TR10", name: "Teliamura", stateId: "TR" },
  { id: "TR11", name: "Melaghar", stateId: "TR" },
  { id: "TR12", name: "Sonamura", stateId: "TR" },
  { id: "TR13", name: "Amarpur", stateId: "TR" },
  { id: "TR14", name: "Sabroom", stateId: "TR" },
  { id: "TR15", name: "Kumarghat", stateId: "TR" },
  { id: "TR16", name: "Santirbazar", stateId: "TR" },
  { id: "TR17", name: "Panisagar", stateId: "TR" },
  { id: "TR18", name: "Jirania", stateId: "TR" },
  { id: "TR19", name: "Mohanpur", stateId: "TR" },
  { id: "TR20", name: "Ranirbazar", stateId: "TR" },

  // Goa
  { id: "GA01", name: "Panaji", stateId: "GA" },
  { id: "GA02", name: "Margao", stateId: "GA" },
  { id: "GA03", name: "Vasco da Gama", stateId: "GA" },
  { id: "GA04", name: "Mapusa", stateId: "GA" },
  { id: "GA05", name: "Ponda", stateId: "GA" },
  { id: "GA06", name: "Bicholim", stateId: "GA" },
  { id: "GA07", name: "Curchorem", stateId: "GA" },
  { id: "GA08", name: "Cuncolim", stateId: "GA" },
  { id: "GA09", name: "Pernem", stateId: "GA" },
  { id: "GA10", name: "Valpoi", stateId: "GA" },
  { id: "GA11", name: "Sanquelim", stateId: "GA" },
  { id: "GA12", name: "Quepem", stateId: "GA" },
  { id: "GA13", name: "Canacona", stateId: "GA" },
  { id: "GA14", name: "Calangute", stateId: "GA" },
  { id: "GA15", name: "Candolim", stateId: "GA" },
  { id: "GA16", name: "Anjuna", stateId: "GA" },
  { id: "GA17", name: "Colva", stateId: "GA" },
  { id: "GA18", name: "Porvorim", stateId: "GA" },
  { id: "GA19", name: "Sanguem", stateId: "GA" },
  { id: "GA20", name: "Arambol", stateId: "GA" },

  // Jammu & Kashmir
  { id: "JK01", name: "Srinagar", stateId: "JK" },
  { id: "JK02", name: "Jammu", stateId: "JK" },
  { id: "JK03", name: "Anantnag", stateId: "JK" },
  { id: "JK04", name: "Baramulla", stateId: "JK" },
  { id: "JK05", name: "Kathua", stateId: "JK" },
  { id: "JK06", name: "Sopore", stateId: "JK" },
  { id: "JK07", name: "Udhampur", stateId: "JK" },
  { id: "JK08", name: "Kupwara", stateId: "JK" },
  { id: "JK09", name: "Pulwama", stateId: "JK" },
  { id: "JK10", name: "Kulgam", stateId: "JK" },
  { id: "JK11", name: "Doda", stateId: "JK" },
  { id: "JK12", name: "Rajouri", stateId: "JK" },
  { id: "JK13", name: "Poonch", stateId: "JK" },
  { id: "JK14", name: "Handwara", stateId: "JK" },
  { id: "JK15", name: "Bandipore", stateId: "JK" },
  { id: "JK16", name: "Ganderbal", stateId: "JK" },
  { id: "JK17", name: "Ramban", stateId: "JK" },
  { id: "JK18", name: "Reasi", stateId: "JK" },
  { id: "JK19", name: "Kishtwar", stateId: "JK" },
  { id: "JK20", name: "Shopian", stateId: "JK" },

  // Ladakh
  { id: "LA01", name: "Leh", stateId: "LA" },
  { id: "LA02", name: "Kargil", stateId: "LA" },
  { id: "LA03", name: "Nubra", stateId: "LA" },
  { id: "LA04", name: "Zanskar", stateId: "LA" },
  { id: "LA05", name: "Diskit", stateId: "LA" },
  { id: "LA06", name: "Khaltse", stateId: "LA" },
  { id: "LA07", name: "Nyoma", stateId: "LA" },
  { id: "LA08", name: "Drass", stateId: "LA" },
  { id: "LA09", name: "Sankoo", stateId: "LA" },
  { id: "LA10", name: "Padum", stateId: "LA" },
  { id: "LA11", name: "Shey", stateId: "LA" },
  { id: "LA12", name: "Choglamsar", stateId: "LA" },
  { id: "LA13", name: "Thiksey", stateId: "LA" },
  { id: "LA14", name: "Alchi", stateId: "LA" },
  { id: "LA15", name: "Sumoor", stateId: "LA" },
  { id: "LA16", name: "Turtuk", stateId: "LA" },
  { id: "LA17", name: "Changthang", stateId: "LA" },
  { id: "LA18", name: "Hemis", stateId: "LA" },
  { id: "LA19", name: "Lamayuru", stateId: "LA" },
  { id: "LA20", name: "Stok", stateId: "LA" }
];

export const getCities = (stateName: string): City[] => {
  const state = INDIAN_STATES.find(s => s.name === stateName);
  if (!state) return [];
  return INDIAN_CITIES.filter(city => city.stateId === state.id);
};

export const getStates = (): State[] => INDIAN_STATES; 