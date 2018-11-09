const periods = {
    neolithic: [
        {
            text: 'Neolithic',
            children: [
                {
                    text: 'Late Neolithic'
                },
                {
                    text: 'Final Neolithic'
                },
                {
                    text: 'Neolithic'
                },
                {
                    text: 'Uncertain Final Neolithic'
                },
                {
                    text: 'Uncertain Neolithic'
                }
            ]
        }
    ],
    bronzeAge: [
        {
            text: 'Bronze Age',
            children: [
                {
                    text: 'Early Bronze Age'
                },
                {
                    text: 'Middle Bronze Age'
                },
                {
                    text: 'Late Bronze Age'
                },
                {
                    text: 'Uncertain Early Bronze Age'
                },
                {
                    text: 'Uncertain Middle Bronze Age'
                },
                {
                    text: 'Uncertain Late Bronze Age'
                }
            ]
        }
    ],
    protoGeometric: [
        {
            text: 'Proto Geometric',
            children: [
                {
                    text: 'Early Proto Geometric'
                },
                {
                    text: 'Middle Proto Geometric'
                },
                {
                    text: 'Late Proto Geometric'
                },
                {
                    text: 'Proto Geometric'
                },
                {
                    text: 'Uncertain Early Proto Geometric'
                },
                {
                    text: 'Uncertain Middle Proto Geometric'
                },
                {
                    text: 'Uncertain Late Proto Geometric'
                },
                {
                    text: 'Uncertain Proto Geometric'
                }
            ]
        }
    ],
    geometric: [
        {
            text: 'Geometric',
            children: [
                {
                    text: 'Early Geometric'
                },
                {
                    text: 'Middle Geometric'
                },
                {
                    text: 'Late Geometric'
                },
                {
                    text: 'Geometric'
                },
                {
                    text: 'Uncertain Early Geometric'
                },
                {
                    text: 'Uncertain Middle Geometric'
                },
                {
                    text: 'Uncertain Late Geometric'
                },
                {
                    text: 'Uncertain Geometric'
                }
            ]
        }
    ],
    archaic: [
        {
            text: 'Archaic',
            children: [
                {
                    text: 'Early Archaic'
                },
                {
                    text: 'Middle Archaic'
                },
                {
                    text: 'Late Archaic'
                },
                {
                    text: 'Archaic'
                },
                {
                    text: 'Uncertain Early Archaic'
                },
                {
                    text: 'Uncertain Middle Archaic'
                },
                {
                    text: 'Uncertain Late Archaic'
                },
                {
                    text: 'Uncertain Archaic'
                }
            ]
        }
    ],
    classical: [
        {
            text: 'Classical',
            children: [
                {
                    text: 'Early Classical'
                },
                {
                    text: 'Middle Classical'
                },
                {
                    text: 'Late Classical'
                },
                {
                    text: 'Classical'
                },
                {
                    text: 'Uncertain Early Classical'
                },
                {
                    text: 'Uncertain Middle Classical'
                },
                {
                    text: 'Uncertain Late Classical'
                },
                {
                    text: 'Uncertain Classical'
                }
            ]
        }
    ],
    hellenistic: [
        {
            text: 'Hellenistic',
            children: [
                {
                    text: 'Early Hellenistic'
                },
                {
                    text: 'Middle Hellenistic'
                },
                {
                    text: 'Late Hellenistic'
                },
                {
                    text: 'Hellenistic'
                },
                {
                    text: 'Uncertain Early Hellenistic'
                },
                {
                    text: 'Uncertain Middle Hellenistic'
                },
                {
                    text: 'Uncertain Late Hellenistic'
                },
                {
                    text: 'Uncertain Hellenistic'
                }
            ]
        }
    ],
    roman: [
        {
            text: 'Roman',
            children: [
                {
                    text: 'Early Roman'
                },
                {
                    text: 'Middle Roman'
                },
                {
                    text: 'Late Roman'
                },
                {
                    text: 'Roman'
                },
                {
                    text: 'Uncertain Early Roman'
                },
                {
                    text: 'Uncertain Middle Roman'
                },
                {
                    text: 'Uncertain Late Roman'
                },
                {
                    text: 'Uncertain Roman'
                }
            ]
        }
    ],
    byzantine: [
        {
            text: 'Byzantine',
            children: [
                {
                    text: 'Early Byzantine'
                },
                {
                    text: 'Middle Byzantine'
                },
                {
                    text: 'Late Byzantine'
                },
                {
                    text: 'Byzantine'
                },
                {
                    text: 'Uncertain Early Byzantine'
                },
                {
                    text: 'Uncertain Middle Byzantine'
                },
                {
                    text: 'Uncertain Late Byzantine'
                },
                {
                    text: 'Uncertain Byzantine'
                }
            ]
        }
    ],
    frankish: [
        {
            text: 'Frankish',
            children: [
                {
                    text: 'Frankish'
                },
                {
                    text: 'Uncertain Frankish'
                }
            ]
        }
    ],
    ottoman: [
        {
            text: 'Ottoman',
            children: [
                {
                    text: 'Ottoman'
                },
                {
                    text: 'Uncertain Ottoman'
                }
            ]
        }
    ],
    modern: [
        {
            text: 'Modern',
            children: [
                {
                    text: 'Modern'
                },
                {
                    text: 'Uncertain Modern'
                }
            ]
        }
    ],
    prehistoric: [
        {
            text: 'Prehistoric',
            children: [
                {
                    text: 'Uncertain prehistoric date'
                }
            ]
        }
    ]
};

const periodCode = {
    'Late Neolithic': 'LN',
    'Final Neolithic': 'FN',
    Neolithic: 'N',
    'Early Bronze Age': 'EBA',
    'Middle Bronze Age': 'MBA',
    'Late Bronze Age': 'LBA',
    'Early Proto Geometric': 'EPG',
    'Middle Proto Geometric': 'MPG',
    'Late Proto Geometric': 'LPG',
    'Proto Geometric': 'PG',
    'Early Geometric': 'EG',
    'Middle Geometric': 'MG',
    'Late Geometric': 'LG',
    Geometric: 'G',
    'Early Archaic': 'EA',
    'Middle Archaic': 'MA',
    'Late Archaic': 'LA',
    Archaic: 'A',
    'Early Classical': 'EC',
    'Middle Classical': 'MC',
    'Late Classical': 'LC',
    Classical: 'C',
    'Early Hellenistic': 'EH',
    'Middle Hellenistic': 'MH',
    'Late Hellenistic': 'LH',
    Hellenistic: 'H',
    'Early Roman': 'ER',
    'Middle Roman': 'MR',
    'Late Roman': 'LR',
    Roman: 'R',
    'Early Byzantine': 'EB',
    'Middle Byzantine': 'MB',
    'Late Byzantine': 'LB',
    Byzantine: 'B',
    Frankish: 'F',
    Ottoman: 'O',
    Modern: 'M',
    'Uncertain prehistoric date': 'xPh',
    'Uncertain Final Neolithic': 'xFN',
    'Uncertain Neolithic': 'xN',
    'Uncertain Early Bronze Age': 'xEBA',
    'Uncertain Middle Bronze Age': 'xMBA',
    'Uncertain Late Bronze Age': 'xLBA',
    'Uncertain Early Proto Geometric': 'xEPG',
    'Uncertain Middle Proto Geometric': 'xMPG',
    'Uncertain Late Proto Geometric': 'xLPG',
    'Uncertain Proto Geometric': 'xPG',
    'Uncertain Early Geometric': 'xEG',
    'Uncertain Middle Geometric': 'xMG',
    'Uncertain Late Geometric': 'xLG',
    'Uncertain Geometric': 'xG',
    'Uncertain Early Archaic': 'xEA',
    'Uncertain Middle Archaic': 'xMA',
    'Uncertain Late Archaic': 'xLA',
    'Uncertain Archaic': 'xA',
    'Uncertain Early Classical': 'xEC',
    'Uncertain Middle Classical': 'xMC',
    'Uncertain Late Classical': 'xLC',
    'Uncertain Classical': 'xC',
    'Uncertain Early Hellenistic': 'xEH',
    'Uncertain Middle Hellenistic': 'xMH',
    'Uncertain Late Hellenistic': 'xLH',
    'Uncertain Hellenistic': 'xH',
    'Uncertain Early Roman': 'xER',
    'Uncertain Middle Roman': 'xMR',
    'Uncertain Late Roman': 'xLR',
    'Uncertain Roman': 'xR',
    'Uncertain Early Byzantine': 'xEB',
    'Uncertain Middle Byzantine': 'xMB',
    'Uncertain Late Byzantine': 'xLB',
    'Uncertain Byzantine': 'xB',
    'Uncertain Frankish': 'xF',
    'Uncertain Ottoman': 'xO',
    'Uncertain Modern': 'xM'
};
