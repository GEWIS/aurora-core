import MixTape from './mix-tape';
import SearchLight from '../../../lights/effects/movement/search-light';
import { SingleFlood } from '../../../lights/effects/color';

const centurion: MixTape = {
  name: 'Gebroeders Scooter - Centurion',
  songFile: '/audio/gebroeders-scooter-centurion.mp3',
  coverUrl: 'https://i1.sndcdn.com/artworks-000660440143-nxgkca-t500x500.jpg',
  duration: 6075,
  feed: [
    {
      timestamp: 1,
      type: 'effect',
      data: {
        effects: [SearchLight.build()],
      },
    },
    {
      timestamp: 39,
      type: 'effect',
      data: {
        effects: [SingleFlood.build()],
      },
    },
    {
      timestamp: 40,
      type: 'effect',
      data: {
        effects: [SingleFlood.build()],
      },
    },
    {
      timestamp: 41,
      type: 'effect',
      data: {
        effects: [SingleFlood.build()],
      },
    },
    {
      timestamp: 41.9,
      type: 'horn',
      data: {
        counter: 0,
      },
    },
    {
      timestamp: 42.0,
      type: 'song',
      data: {
        artist: 'Nena',
        title: '99 Luftballons',
      },
    },
    {
      timestamp: 108.5,
      type: 'horn',
      data: {
        counter: 1,
      },
    },
    {
      timestamp: 148.0,
      type: 'song',
      data: {
        artist: 'Hermes House Band',
        title: 'Country Roads',
      },
    },
    {
      timestamp: 166.99,
      type: 'horn',
      data: {
        counter: 2,
      },
    },
    {
      timestamp: 185.0,
      type: 'song',
      data: {
        artist: 'Vinzzent',
        title: 'Dromendans',
      },
    },
    {
      timestamp: 222.95,
      type: 'horn',
      data: {
        counter: 3,
      },
    },
    {
      timestamp: 223.0,
      type: 'song',
      data: {
        artist: 'Linda, Roos & Jessica',
        title: 'Ademnood',
      },
    },
    {
      timestamp: 283.0,
      type: 'song',
      data: {
        artist: 'Peter de Koning',
        title: 'Het is altijd lente in de ogen van de tandarts-assistente',
      },
    },
    {
      timestamp: 283.5,
      type: 'horn',
      data: {
        counter: 4,
      },
    },
    {
      timestamp: 339.5,
      type: 'horn',
      data: {
        counter: 5,
      },
    },
    {
      timestamp: 340.0,
      type: 'song',
      data: {
        artist: 'Liquido',
        title: 'Narcotic',
      },
    },
    {
      timestamp: 411.68,
      type: 'horn',
      data: {
        counter: 6,
      },
    },
    {
      timestamp: 412.0,
      type: 'song',
      data: {
        artist: 'Snoop Dogg feat. Pharrell',
        title: "Drop It Like It's Hot",
      },
    },
    {
      timestamp: 449.0,
      type: 'song',
      data: {
        artist: 'M.O.P.',
        title: 'Ante Up',
      },
    },
    {
      timestamp: 458.3,
      type: 'horn',
      data: {
        counter: 7,
      },
    },
    {
      timestamp: 514.0,
      type: 'song',
      data: {
        artist: 'Los Del Rio',
        title: 'Macarena',
      },
    },
    {
      timestamp: 514.27,
      type: 'horn',
      data: {
        counter: 8,
      },
    },
    {
      timestamp: 560.0,
      type: 'song',
      data: {
        artist: 'Spice Girls',
        title: 'Wannabe',
      },
    },
    {
      timestamp: 573.85,
      type: 'horn',
      data: {
        counter: 9,
      },
    },
    {
      timestamp: 617.0,
      type: 'song',
      data: {
        artist: 'Major Lazer feat. Busy Signal, The Flexican & FS Green',
        title: 'Watch Out For This (Bumaye)',
      },
    },
    {
      timestamp: 634.46,
      type: 'horn',
      data: {
        counter: 10,
      },
    },
    {
      timestamp: 650.0,
      type: 'song',
      data: {
        artist: 'André van Duin',
        title: 'Er staat een paard in de gang',
      },
    },
    {
      timestamp: 667.0,
      type: 'song',
      data: {
        artist: 'Lil Kleine & Ronnie Flex',
        title: 'Drank & Drugs',
      },
    },
    {
      timestamp: 684.0,
      type: 'song',
      data: {
        artist: 'Kabouter Plop',
        title: 'Kabouterdans',
      },
    },
    {
      timestamp: 698.83,
      type: 'horn',
      data: {
        counter: 11,
      },
    },
    {
      timestamp: 725.0,
      type: 'song',
      data: {
        artist: 'K3',
        title: 'Alle kleuren',
      },
    },
    {
      timestamp: 756.1,
      type: 'horn',
      data: {
        counter: 12,
      },
    },
    {
      timestamp: 757.0,
      type: 'song',
      data: {
        artist: 'Kinderen voor Kinderen',
        title: 'Tietenlied',
      },
    },
    {
      timestamp: 811.5,
      type: 'horn',
      data: {
        counter: 13,
      },
    },
    {
      timestamp: 814.0,
      type: 'song',
      data: {
        artist: 'Guus Meeuwis',
        title: 'Het dondert en het bliksemt',
      },
    },
    {
      timestamp: 873.8,
      type: 'horn',
      data: {
        counter: 14,
      },
    },
    {
      timestamp: 876.0,
      type: 'song',
      data: {
        artist: 'Harry Vermeegen',
        title: '1-2-3-4 Dennis bier',
      },
    },
    {
      timestamp: 906.0,
      type: 'song',
      data: {
        artist: 'Puhdys',
        title: "Hey, wir woll’n die Eisbär'n sehn!",
      },
    },
    {
      timestamp: 934.9,
      type: 'horn',
      data: {
        counter: 15,
      },
    },
    {
      timestamp: 966.0,
      type: 'song',
      data: {
        artist: 'DJ Ötzi',
        title: 'Burger Dance',
      },
    },
    {
      timestamp: 994.7,
      type: 'horn',
      data: {
        counter: 16,
      },
    },
    {
      timestamp: 996.0,
      type: 'song',
      data: {
        artist: 'Mickie Krause',
        title: 'Hütte auf der Alm',
      },
    },
    {
      timestamp: 1030.0,
      type: 'song',
      data: {
        artist: 'Ali B & Yes-R & The Partysquad',
        title: 'Rampeneren',
      },
    },
    {
      timestamp: 1045.7,
      type: 'horn',
      data: {
        counter: 17,
      },
    },
    {
      timestamp: 1106.41,
      type: 'horn',
      data: {
        counter: 18,
      },
    },
    {
      timestamp: 1107.0,
      type: 'song',
      data: {
        artist: 'Martin Solveig',
        title: 'Intoxicated',
      },
    },
    {
      timestamp: 1137.0,
      type: 'song',
      data: {
        artist: 'Nicki Minaj',
        title: 'Starships',
      },
    },
    {
      timestamp: 1172.72,
      type: 'horn',
      data: {
        counter: 19,
      },
    },
    {
      timestamp: 1222.0,
      type: 'song',
      data: {
        artist: '2Unlimited',
        title: 'Get Ready For This',
      },
    },
    {
      timestamp: 1235.15,
      type: 'horn',
      data: {
        counter: 20,
      },
    },
    {
      timestamp: 1275.0,
      type: 'song',
      data: {
        artist: 'The Village People',
        title: 'YMCA',
      },
    },
    {
      timestamp: 1288.8,
      type: 'horn',
      data: {
        counter: 21,
      },
    },
    {
      timestamp: 1348.4,
      type: 'horn',
      data: {
        counter: 22,
      },
    },
    {
      timestamp: 1350.0,
      type: 'song',
      data: {
        artist: 'Carly Rae Jepsen ft Owl City',
        title: "It's Always A Good Time",
      },
    },
    {
      timestamp: 1395.0,
      type: 'song',
      data: {
        artist: 'Avicii',
        title: 'Levels',
      },
    },
    {
      timestamp: 1410.38,
      type: 'horn',
      data: {
        counter: 23,
      },
    },
    {
      timestamp: 1456.0,
      type: 'song',
      data: {
        artist: 'Flo-Rida feat. T-Pain',
        title: 'Low',
      },
    },
    {
      timestamp: 1470.45,
      type: 'horn',
      data: {
        counter: 24,
      },
    },
    {
      timestamp: 1486.0,
      type: 'song',
      data: {
        artist: 'Taio Cruz',
        title: 'Hangover',
      },
    },
    {
      timestamp: 1530.36,
      type: 'horn',
      data: {
        counter: 25,
      },
    },
    {
      timestamp: 1545.0,
      type: 'song',
      data: {
        artist: 'LMFAO',
        title: 'Party Rock Anthem',
      },
    },
    {
      timestamp: 1593.63,
      type: 'horn',
      data: {
        counter: 26,
      },
    },
    {
      timestamp: 1594.0,
      type: 'song',
      data: {
        artist: 'Hans Entertainment vs. Finger & Kadel',
        title: 'Hoch die Hände',
      },
    },
    {
      timestamp: 1623.0,
      type: 'song',
      data: {
        artist: 'Galantis',
        title: 'No Money',
      },
    },
    {
      timestamp: 1653.0,
      type: 'horn',
      data: {
        counter: 27,
      },
    },
    {
      timestamp: 1683.0,
      type: 'song',
      data: {
        artist: 'Kid Cudi',
        title: 'Pursuit of Happiness (Steve Aoki remix)',
      },
    },
    {
      timestamp: 1711.91,
      type: 'horn',
      data: {
        counter: 28,
      },
    },
    {
      timestamp: 1741.0,
      type: 'song',
      data: {
        artist: 'Yeah Yeah Yeahs',
        title: 'Heads Will Roll (A-Trak remix)',
      },
    },
    {
      timestamp: 1768.71,
      type: 'horn',
      data: {
        counter: 29,
      },
    },
    {
      timestamp: 1814.0,
      type: 'song',
      data: {
        artist: 'Michael Calfan',
        title: 'Resurrection',
      },
    },
    {
      timestamp: 1828.9,
      type: 'horn',
      data: {
        counter: 30,
      },
    },
    {
      timestamp: 1858.0,
      type: 'song',
      data: {
        artist: 'Basto!',
        title: 'Again and Again',
      },
    },
    {
      timestamp: 1886.9,
      type: 'horn',
      data: {
        counter: 31,
      },
    },
    {
      timestamp: 1916.0,
      type: 'song',
      data: {
        artist: 'David Guetta feat. Sia',
        title: 'Titanium',
      },
    },
    {
      timestamp: 1944.9,
      type: 'horn',
      data: {
        counter: 32,
      },
    },
    {
      timestamp: 1959.0,
      type: 'song',
      data: {
        artist: 'Gala',
        title: 'Freed From Desire',
      },
    },
    {
      timestamp: 2004.1,
      type: 'horn',
      data: {
        counter: 33,
      },
    },
    {
      timestamp: 2034.0,
      type: 'song',
      data: {
        artist: 'Wolter Kroes',
        title: 'Viva Hollandia',
      },
    },
    {
      timestamp: 2063.97,
      type: 'horn',
      data: {
        counter: 34,
      },
    },
    {
      timestamp: 2090.0,
      type: 'song',
      data: {
        artist: 'Spongebob Squarepants',
        title: 'Het Spongebob Squarepants-lied',
      },
    },
    {
      timestamp: 2124.7,
      type: 'horn',
      data: {
        counter: 35,
      },
    },
    {
      timestamp: 2128.0,
      type: 'song',
      data: {
        artist: 'Westlife',
        title: 'Uptown Girl',
      },
    },
    {
      timestamp: 2179.0,
      type: 'song',
      data: {
        artist: 'Aqua',
        title: 'Barbie Girl',
      },
    },
    {
      timestamp: 2193.89,
      type: 'horn',
      data: {
        counter: 36,
      },
    },
    {
      timestamp: 2225.0,
      type: 'song',
      data: {
        artist: 'Guillermo & Tropical Danny',
        title: 'Toppertje',
      },
    },
    {
      timestamp: 2244.79,
      type: 'horn',
      data: {
        counter: 37,
      },
    },
    {
      timestamp: 2304.47,
      type: 'horn',
      data: {
        counter: 38,
      },
    },
    {
      timestamp: 2305.0,
      type: 'song',
      data: {
        artist: 'The Bloody Beetroots feat. Steve Aoki',
        title: 'Warp 1.9',
      },
    },
    {
      timestamp: 2373.39,
      type: 'horn',
      data: {
        counter: 39,
      },
    },
    {
      timestamp: 2374.0,
      type: 'song',
      data: {
        artist: 'David Guetta & Showtek feat. Vassy',
        title: 'Bad',
      },
    },
    {
      timestamp: 2431.0,
      type: 'song',
      data: {
        artist: 'Showtek & Justin Prime',
        title: 'Cannonball',
      },
    },
    {
      timestamp: 2431.2,
      type: 'horn',
      data: {
        counter: 40,
      },
    },
    {
      timestamp: 2460.0,
      type: 'song',
      data: {
        artist: 'Die Atzen',
        title: 'Disco Pogo',
      },
    },
    {
      timestamp: 2488.6,
      type: 'horn',
      data: {
        counter: 41,
      },
    },
    {
      timestamp: 2534.0,
      type: 'song',
      data: {
        artist: 'Lorenz Büffel',
        title: 'Johnny Däpp',
      },
    },
    {
      timestamp: 2554.9,
      type: 'horn',
      data: {
        counter: 42,
      },
    },
    {
      timestamp: 2587.0,
      type: 'song',
      data: {
        artist: 'Zware Jongens',
        title: 'Jodeljump',
      },
    },
    {
      timestamp: 2606.35,
      type: 'horn',
      data: {
        counter: 43,
      },
    },
    {
      timestamp: 2635.0,
      type: 'song',
      data: {
        artist: 'Parla & Pardoux',
        title: 'Liberté',
      },
    },
    {
      timestamp: 2663.46,
      type: 'horn',
      data: {
        counter: 44,
      },
    },
    {
      timestamp: 2695.0,
      type: 'song',
      data: {
        artist: 'Markus Becker',
        title: 'Das rote Pferd',
      },
    },
    {
      timestamp: 2729.0,
      type: 'horn',
      data: {
        counter: 45,
      },
    },
    {
      timestamp: 2743.0,
      type: 'song',
      data: {
        artist: 'Olaf Henning',
        title: 'Cowboy und Indianer',
      },
    },
    {
      timestamp: 2783.3,
      type: 'horn',
      data: {
        counter: 46,
      },
    },
    {
      timestamp: 2785.0,
      type: 'song',
      data: {
        artist: 'Ch!pz',
        title: 'Cowboy',
      },
    },
    {
      timestamp: 2824.0,
      type: 'song',
      data: {
        artist: 'Toy-Box',
        title: 'Tarzan & Jane',
      },
    },
    {
      timestamp: 2849.4,
      type: 'horn',
      data: {
        counter: 47,
      },
    },
    {
      timestamp: 2879.0,
      type: 'song',
      data: {
        artist: 'Toy-Box',
        title: 'Sailor Song',
      },
    },
    {
      timestamp: 2919.0,
      type: 'horn',
      data: {
        counter: 48,
      },
    },
    {
      timestamp: 2922.0,
      type: 'song',
      data: {
        artist: 'Vengaboys',
        title: 'Boom, Boom, Boom, Boom!!',
      },
    },
    {
      timestamp: 2974.58,
      type: 'horn',
      data: {
        counter: 49,
      },
    },
    {
      timestamp: 2998.0,
      type: 'song',
      data: {
        artist: 'Vengaboys',
        title: 'To Brazil!',
      },
    },
    {
      timestamp: 3038.76,
      type: 'horn',
      data: {
        counter: 50,
      },
    },
    {
      timestamp: 3070.0,
      type: 'song',
      data: {
        artist: 'Snollebollekes',
        title: 'Bam bam (bam)',
      },
    },
    {
      timestamp: 3103.18,
      type: 'horn',
      data: {
        counter: 51,
      },
    },
    {
      timestamp: 3120.0,
      type: 'song',
      data: {
        artist: 'Def Rhymz',
        title: 'Schudden',
      },
    },
    {
      timestamp: 3160.16,
      type: 'horn',
      data: {
        counter: 52,
      },
    },
    {
      timestamp: 3190.0,
      type: 'song',
      data: {
        artist: 'Cooldown Café',
        title: 'Hey baby',
      },
    },
    {
      timestamp: 3214.8,
      type: 'horn',
      data: {
        counter: 53,
      },
    },
    {
      timestamp: 3232.0,
      type: 'song',
      data: {
        artist: 'Gebroeders Ko',
        title: 'Schatje, mag ik je foto',
      },
    },
    {
      timestamp: 3278.55,
      type: 'horn',
      data: {
        counter: 54,
      },
    },
    {
      timestamp: 3279.0,
      type: 'song',
      data: {
        artist: 'Guus Meeuwis',
        title: 'Het is een nacht',
      },
    },
    {
      timestamp: 3340.8,
      type: 'horn',
      data: {
        counter: 55,
      },
    },
    {
      timestamp: 3356.0,
      type: 'song',
      data: {
        artist: 'Tom Waes',
        title: 'Dos cervezas',
      },
    },
    {
      timestamp: 3398.04,
      type: 'horn',
      data: {
        counter: 56,
      },
    },
    {
      timestamp: 3412.0,
      type: 'song',
      data: {
        artist: 'Peter Wackel',
        title: 'Vollgas',
      },
    },
    {
      timestamp: 3439.0,
      type: 'song',
      data: {
        artist: 'Peter Wackel',
        title: 'Scheiß drauf!',
      },
    },
    {
      timestamp: 3464.95,
      type: 'horn',
      data: {
        counter: 57,
      },
    },
    {
      timestamp: 3467.0,
      type: 'song',
      data: {
        artist: 'Ikke Hüftgold',
        title: 'Dicke titten, kartoffelsalat',
      },
    },
    {
      timestamp: 3519.75,
      type: 'horn',
      data: {
        counter: 58,
      },
    },
    {
      timestamp: 3521.0,
      type: 'song',
      data: {
        artist: 'Tim Toupet',
        title: 'Fliegerlied (So ein schöner Tag)',
      },
    },
    {
      timestamp: 3564.0,
      type: 'song',
      data: {
        artist: 'Cooldown Café',
        title: "Met z'n allen",
      },
    },
    {
      timestamp: 3576.36,
      type: 'horn',
      data: {
        counter: 59,
      },
    },
    {
      timestamp: 3642.86,
      type: 'horn',
      data: {
        counter: 60,
      },
    },
    {
      timestamp: 3659.0,
      type: 'song',
      data: {
        artist: 'The Partysquad feat. Jayh, Sjaak & Reverse',
        title: 'Helemaal naar de klote',
      },
    },
    {
      timestamp: 3687.0,
      type: 'song',
      data: {
        artist: 'K-Liber',
        title: 'Viben',
      },
    },
    {
      timestamp: 3699.38,
      type: 'horn',
      data: {
        counter: 61,
      },
    },
    {
      timestamp: 3752.85,
      type: 'horn',
      data: {
        counter: 62,
      },
    },
    {
      timestamp: 3755.0,
      type: 'song',
      data: {
        artist: 'FeestDJRuud & Dirtcaps feat. Sjaak & Kraantje Pappie',
        title: 'Weekend',
      },
    },
    {
      timestamp: 3807.6,
      type: 'horn',
      data: {
        counter: 63,
      },
    },
    {
      timestamp: 3808.0,
      type: 'song',
      data: {
        artist: 'Lawineboys',
        title: 'Joost',
      },
    },
    {
      timestamp: 3860.0,
      type: 'song',
      data: {
        artist: 'Gebroeders Ko',
        title: 'Ik heb een toeter op mijn waterscooter',
      },
    },
    {
      timestamp: 3873.6,
      type: 'horn',
      data: {
        counter: 64,
      },
    },
    {
      timestamp: 3904.0,
      type: 'song',
      data: {
        artist: 'Gebroeders Ko',
        title: 'Tringeling',
      },
    },
    {
      timestamp: 3931.55,
      type: 'horn',
      data: {
        counter: 65,
      },
    },
    {
      timestamp: 3975.0,
      type: 'song',
      data: {
        artist: 'Basshunter',
        title: 'Boten Anna',
      },
    },
    {
      timestamp: 3987.41,
      type: 'horn',
      data: {
        counter: 66,
      },
    },
    {
      timestamp: 4029.0,
      type: 'song',
      data: {
        artist: 'Lawineboys',
        title: 'Wat zullen we drinken',
      },
    },
    {
      timestamp: 4050.0,
      type: 'horn',
      data: {
        counter: 67,
      },
    },
    {
      timestamp: 4081.0,
      type: 'song',
      data: {
        artist: 'Lamme Frans',
        title: 'Wakker met een biertje!',
      },
    },
    {
      timestamp: 4112.8,
      type: 'horn',
      data: {
        counter: 68,
      },
    },
    {
      timestamp: 4124.18,
      type: 'song',
      data: {
        artist: 'Lawineboys feat. DJ Jerome',
        title: 'Seks met die kale',
      },
    },
    {
      timestamp: 4175.0,
      type: 'horn',
      data: {
        counter: 69,
      },
    },
    {
      timestamp: 4177.0,
      type: 'song',
      data: {
        artist: 'Zombie Nation',
        title: 'Kernkraft 400',
      },
    },
    {
      timestamp: 4227.53,
      type: 'horn',
      data: {
        counter: 70,
      },
    },
    {
      timestamp: 4230.0,
      type: 'song',
      data: {
        artist: 'DJ Boozywoozy',
        title: 'Party Affair',
      },
    },
    {
      timestamp: 4280.12,
      type: 'horn',
      data: {
        counter: 71,
      },
    },
    {
      timestamp: 4289.0,
      type: 'song',
      data: {
        artist: '2Unlimited',
        title: 'No Limit',
      },
    },
    {
      timestamp: 4340.73,
      type: 'horn',
      data: {
        counter: 72,
      },
    },
    {
      timestamp: 4343.0,
      type: 'song',
      data: {
        artist: 'DJ Kicken vs. MC-Q',
        title: "Ain't No Party",
      },
    },
    {
      timestamp: 4408.0,
      type: 'horn',
      data: {
        counter: 73,
      },
    },
    {
      timestamp: 4411.0,
      type: 'song',
      data: {
        artist: 'Jan Wayne',
        title: 'Becuase the Night',
      },
    },
    {
      timestamp: 4455.0,
      type: 'song',
      data: {
        artist: 'Cascada',
        title: 'Everytime We Touch',
      },
    },
    {
      timestamp: 4466.8,
      type: 'horn',
      data: {
        counter: 74,
      },
    },
    {
      timestamp: 4510.0,
      type: 'song',
      data: {
        artist: "Gigi D'Agostino",
        title: "L'amour toujours",
      },
    },
    {
      timestamp: 4520.84,
      type: 'horn',
      data: {
        counter: 75,
      },
    },
    {
      timestamp: 4573.0,
      type: 'song',
      data: {
        artist: 'Jason Paige',
        title: "Gotta Catch 'M All",
      },
    },
    {
      timestamp: 4578.0,
      type: 'horn',
      data: {
        counter: 76,
      },
    },
    {
      timestamp: 4636.0,
      type: 'song',
      data: {
        artist: 'Scooter',
        title: 'How Much Is The Fish',
      },
    },
    {
      timestamp: 4644.94,
      type: 'horn',
      data: {
        counter: 77,
      },
    },
    {
      timestamp: 4674.0,
      type: 'song',
      data: {
        artist: 'Scooter',
        title: 'Weekend',
      },
    },
    {
      timestamp: 4700.5,
      type: 'horn',
      data: {
        counter: 78,
      },
    },
    {
      timestamp: 4714.0,
      type: 'song',
      data: {
        artist: 'Scooter',
        title: 'One (Always Hardcore)',
      },
    },
    {
      timestamp: 4764.0,
      type: 'horn',
      data: {
        counter: 79,
      },
    },
    {
      timestamp: 4766.0,
      type: 'song',
      data: {
        artist: 'Scooter',
        title: 'Maria (I Like It Loud)',
      },
    },
    {
      timestamp: 4818.0,
      type: 'song',
      data: {
        artist: 'Scooter',
        title: "J'adore Hardcore",
      },
    },
    {
      timestamp: 4829.1,
      type: 'horn',
      data: {
        counter: 80,
      },
    },
    {
      timestamp: 4860.0,
      type: 'song',
      data: {
        artist: 'Wildstylez feat. Niels Geusebroek',
        title: 'Year of Summer',
      },
    },
    {
      timestamp: 4887.7,
      type: 'horn',
      data: {
        counter: 81,
      },
    },
    {
      timestamp: 4929.0,
      type: 'song',
      data: {
        artist: 'Brennan Heart & Wildstylez',
        title: 'Lose My Mind',
      },
    },
    {
      timestamp: 4952.43,
      type: 'horn',
      data: {
        counter: 82,
      },
    },
    {
      timestamp: 5004.5,
      type: 'horn',
      data: {
        counter: 83,
      },
    },
    {
      timestamp: 5006.0,
      type: 'song',
      data: {
        artist: 'Starkoo',
        title: 'Ik wil je',
      },
    },
    {
      timestamp: 5059.0,
      type: 'song',
      data: {
        artist: 'Feestteam',
        title: 'Let It Be / Hey Jude (mix)',
      },
    },
    {
      timestamp: 5070.43,
      type: 'horn',
      data: {
        counter: 84,
      },
    },
    {
      timestamp: 5124.46,
      type: 'horn',
      data: {
        counter: 85,
      },
    },
    {
      timestamp: 5179.0,
      type: 'song',
      data: {
        artist: 'DJ Nikolai & DJ Mike van Dijk',
        title: 'Piano Man',
      },
    },
    {
      timestamp: 5187.8,
      type: 'horn',
      data: {
        counter: 86,
      },
    },
    {
      timestamp: 5237.0,
      type: 'song',
      data: {
        artist: 'Robbie Williams',
        title: 'Angels',
      },
    },
    {
      timestamp: 5242.71,
      type: 'horn',
      data: {
        counter: 87,
      },
    },
    {
      timestamp: 5278.0,
      type: 'song',
      data: {
        artist: 'Enrique Iglesias',
        title: 'Hero',
      },
    },
    {
      timestamp: 5307.7,
      type: 'horn',
      data: {
        counter: 88,
      },
    },
    {
      timestamp: 5331.0,
      type: 'song',
      data: {
        artist: 'Whitney Houston',
        title: 'I Will Always Love You',
      },
    },
    {
      timestamp: 5373.8,
      type: 'horn',
      data: {
        counter: 89,
      },
    },
    {
      timestamp: 5380.0,
      type: 'song',
      data: {
        artist: 'Mariah Carey',
        title: 'All I Want For Christmas',
      },
    },
    {
      timestamp: 5431.74,
      type: 'horn',
      data: {
        counter: 90,
      },
    },
    {
      timestamp: 5444.0,
      type: 'song',
      data: {
        artist: 'Kraantje Pappie',
        title: 'Feesttent (FeestDJRuud remix)',
      },
    },
    {
      timestamp: 5487.8,
      type: 'horn',
      data: {
        counter: 91,
      },
    },
    {
      timestamp: 5490.25,
      type: 'song',
      data: {
        artist: 'New Kids feat. DJ Paul Elstak',
        title: 'Turbo',
      },
    },
    {
      timestamp: 5555.55,
      type: 'horn',
      data: {
        counter: 92,
      },
    },
    {
      timestamp: 5558.0,
      type: 'song',
      data: {
        artist: 'Lipstick',
        title: "I'm a Raver",
      },
    },
    {
      timestamp: 5591.0,
      type: 'song',
      data: {
        artist: 'Nakatomi',
        title: 'Children of the Night',
      },
    },
    {
      timestamp: 5612.0,
      type: 'horn',
      data: {
        counter: 93,
      },
    },
    {
      timestamp: 5614.0,
      type: 'song',
      data: {
        artist: 'Charly Lownoise & Mental Theo',
        title: 'Wonderful Days',
      },
    },
    {
      timestamp: 5659.0,
      type: 'song',
      data: {
        artist: 'DJ Paul Elstak',
        title: 'Luv You More',
      },
    },
    {
      timestamp: 5667.15,
      type: 'horn',
      data: {
        counter: 94,
      },
    },
    {
      timestamp: 5704.0,
      type: 'song',
      data: {
        artist: 'DJ Paul Elstak',
        title: 'Rainbow In The Sky',
      },
    },
    {
      timestamp: 5730.65,
      type: 'horn',
      data: {
        counter: 95,
      },
    },
    {
      timestamp: 5733.0,
      type: 'song',
      data: {
        artist: 'Evil Activities',
        title: 'Nobody Said It Was Easy',
      },
    },
    {
      timestamp: 5782.9,
      type: 'horn',
      data: {
        counter: 96,
      },
    },
    {
      timestamp: 5827.0,
      type: 'song',
      data: {
        artist: 'Melrose',
        title: 'O',
      },
    },
    {
      timestamp: 5846.32,
      type: 'horn',
      data: {
        counter: 97,
      },
    },
    {
      timestamp: 5855.0,
      type: 'song',
      data: {
        artist: 'Backstreet Boys',
        title: 'I Want It That Way',
      },
    },
    {
      timestamp: 5902.03,
      type: 'horn',
      data: {
        counter: 98,
      },
    },
    {
      timestamp: 5933.0,
      type: 'song',
      data: {
        artist: 'R. Kelly',
        title: "The World's Greatest",
      },
    },
    {
      timestamp: 5969.88,
      type: 'horn',
      data: {
        counter: 99,
      },
    },
    {
      timestamp: 5970.0,
      type: 'song',
      data: {
        artist: 'Céline Dion',
        title: 'My Heart Will Go On',
      },
    },
    {
      timestamp: 6020.0,
      type: 'horn',
      data: {
        counter: 100,
      },
    },
  ],
};

export default centurion;
