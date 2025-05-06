const employeeNameMap: Record<string, string> = {
  'mulyadi.pane': 'Muhammad Mulyadi Pane',
  'yuni.arfa': 'Yuni Arfa Sahupala',
  'fadhil.mukhti': 'Fadhil Mukti Ardhana',
  'italia.sandi': 'Italia Sandi',
  'siti.aulia': 'Siti Aulia Fanath',
  'febriyeni.susi': 'Febriyeni Susi',
  'azis.tuharea': 'Abdul Azis Tuharea',
  'sudirman.kau': 'Sudirman Kau',
  'rosa.audia': 'Rosa Audia Lillah',
  'herpanindra': 'Herpanindra Fadhilah',
  'davin.giovani': 'Davin Giovanni Batara Francisco Nainggolan',
  'bagus.adji': 'Muhamad Bagus Adji Briliyanto',
  'rizkiani.ihfa': 'Rizkiani Ihfa',
  'iksan.azwar': 'Iksan Azwar Risahondua',
  'azwar.sidik': 'Muhammad Azwar Sidik',
  'anzilna.luthfa': 'Anzilna Luthfa Asyfiya',
  'shania.nendisa': 'Shania Maranatha Sofitje Nendissa',
  'vanny.satumalay': 'Vanny Anna Paulina Satumalay',
  'irawan.ghazali': 'Irawan Ghazali',
  'christo.erie': 'Christian Harry Soplantila'
};

const employeeDepartmentMap: Record<string, string> = {
  'mulyadi.pane': 'IPDS',
  'yuni.arfa': 'Produksi',
  'fadhil.mukhti': 'Produksi',
  'italia.sandi': 'Produksi',
  'siti.aulia': 'Distribusi',
  'febriyeni.susi': 'Distribusi',
  'azis.tuharea': 'Produksi',
  'sudirman.kau': 'Distribusi',
  'rosa.audia': 'Distribusi',
  'herpanindra': 'Neraca',
  'davin.giovani': 'Neraca',
  'bagus.adji': 'Sosial',
  'rizkiani.ihfa': 'Sosial',
  'iksan.azwar': 'Sub Bagian Umum',
  'azwar.sidik': 'Sub Bagian Umum',
  'anzilna.luthfa': 'Sub Bagian Umum',
  'shania.nendisa': 'Sub Bagian Umum',
  'vanny.satumalay': 'Sub Bagian Umum',
  'irawan.ghazali': 'Sub Bagian Umum',
  'christo.erie': 'IPDS'
};

const employeePositionMap: Record<string, string> = {
  'mulyadi.pane': 'Statistisi Ahli Muda',
  'yuni.arfa': 'Pelaksana',
  'fadhil.mukhti': 'Statistisi Ahli Pertama',
  'italia.sandi': 'Statistisi Ahli Muda',
  'siti.aulia': 'Statistisi Pelaksana',
  'febriyeni.susi': 'Statistisi Ahli Pertama',
  'azis.tuharea': 'Pelaksana',
  'sudirman.kau': 'Pelaksana',
  'rosa.audia': 'Statistisi Ahli Pertama',
  'herpanindra': 'Statistisi Ahli Pertama',
  'davin.giovani': 'Statistisi Ahli Pertama',
  'bagus.adji': 'Statistisi Ahli Pertama',
  'rizkiani.ihfa': 'Statistisi Ahli Pertama',
  'iksan.azwar': 'Statistisi Ahli Pertama',
  'azwar.sidik': 'Statistisi Pelaksana',
  'anzilna.luthfa': 'Statistisi Ahli Pertama',
  'shania.nendisa': 'Statistisi Pelaksana',
  'vanny.satumalay': 'Kasubag',
  'irawan.ghazali': 'Statistisi Ahli Pertama'
};

export const getEmployeeName = (email: string): string => {
  const username = email.split('@')[0];
  return employeeNameMap[username] || username;
};

export const getEmployeeDepartment = (email: string): string => {
  const username = email.split('@')[0];
  return employeeDepartmentMap[username] || 'IPDS';
};

export const getEmployeePosition = (email: string): string => {
  const username = email.split('@')[0];
  return employeePositionMap[username] || 'Statistisi Pelaksana';
};