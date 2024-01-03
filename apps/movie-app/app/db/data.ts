export type Movie = {
  slug: string;
  title: string;
  criticScore: number;
  audienceScore: number;
  criticsConsensus: string;
  boxOffice: string;
  imgUrl: string;
  liked: boolean;
  reviews: Review[];
};

export type Review = {
  quote: string;
  fresh: boolean;
  criticName: string;
  criticSource: string;
};

export type Objects = {
  Movie: Movie;
  Review: Review;
};

export const movies: Movie[] = [
  {
    slug: "lady_bird",
    title: "Lady Bird",
    criticScore: 99,
    audienceScore: 79,
    criticsConsensus:
      "Lady Bird delivers fresh insights about the turmoil of adolescence — and reveals writer-director Greta Gerwig as a fully formed filmmaking talent.",
    boxOffice: "$48.9M",
    imgUrl:
      "https://resizing.flixster.com/RldEI9TKeGI7afFzLTtitjj3zvY=/206x305/v2/https://resizing.flixster.com/LOtla2hZ_dEZ8mLjLKYYUX5NLyo=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzI4MjU0NjdiLTMwYTQtNDVmNy1hYjdjLWYwNTk5NTc0MGQ3MC53ZWJw",
    liked: false,
    reviews: [
      {
        quote:
          "Lady Bird combines wisdom and tenderness, humor and grace. It's light-footed without being lightweight. And it captures, with great feeling, the turbulence of a girl growing up. I can't recommend it enough.",
        fresh: true,
        criticName: "Anupama Chopra",
        criticSource: "Film Companion",
      },
      {
        quote:
          "Greta Gerwig's directorial debut, Lady Bird, is the millisecond of possibility, the speck of unflinching nerve, which might only occur once in our lives.",
        fresh: true,
        criticName: "Robert Daniels",
        criticSource: "812filmreviews",
      },
      {
        quote:
          "It is a female coming-of-age story that is both nostalgic and unflinching, and it will ensnare you deeply in its grasp.",
        fresh: true,
        criticName: "Roxana Hadadi",
        criticSource: "Pajiba",
      },
      {
        quote:
          "The densely packed detail which makes this such a luminous work shows Gerwig to be an uncommonly alert filmmaker.",
        fresh: true,
        criticName: "Ryan Gilbey",
        criticSource: "New Statesman",
      },
      {
        quote: "One of the finest teen comedies ever. Movie perfection",
        fresh: true,
        criticName: "Larushka Ivan-Zadeh",
        criticSource: "Metro Newspaper (UK)",
      },
      {
        quote:
          "One element of the film's genius is its ability to root us firmly in Lady Bird's perspective. It does more.",
        fresh: true,
        criticName: "Donald Clarke",
        criticSource: "Irish Times",
      },
      {
        quote:
          "Lady Bird is one of the best, realest explorations of the mother daughter relationship ever put to screen.",
        fresh: true,
        criticName: "Rebecca Johnson",
        criticSource: "Film Focus Online",
      },
      {
        quote:
          "Gerwig’s debut is one that will always be relevant, no matter the year. Music will change, fashion will change, but the feelings that Gerwig captures will be forever.",
        fresh: true,
        criticName: "Tina Kakadelis",
        criticSource: "Beyond the Cinerama Dome",
      },
      {
        quote:
          "The warmth, hilarity and at times confronting revelations of teenagehood flood through Gerwig's singular lens.",
        fresh: true,
        criticName: "Jennifer Bisset",
        criticSource: "CNET",
      },
      {
        quote:
          "Its 2002 post-911 setting feels relevant, its portrait of adolescence feels genuine and personal, and its pitch-perfect and bittersweet final shot lands just right.",
        fresh: true,
        criticName: "Keith Garlington",
        criticSource: "Keith & the Movies",
      },
      {
        quote:
          "Gerwig bows a modest, spirited film of idiosyncratic dialogue, mannered style, and sharp insight, providing an incredible showcase for the talents of Ronan and Metcalf, as well as her own.",
        fresh: true,
        criticName: "Brian Eggert",
        criticSource: "Deep Focus Review",
      },
      {
        quote: "Greta Gerwig is a major talent.",
        fresh: true,
        criticName: "Fletcher Powell",
        criticSource: "KMUW - Wichita Public Radio",
      },
    ],
  },
  {
    slug: "downsizing",
    title: "Downsizing",
    criticScore: 47,
    audienceScore: 25,
    criticsConsensus:
      "Downsizing assembles a talented cast in pursuit of some truly interesting ideas — which may be enough for some audiences to forgive the final product's frustrating shortcomings.",
    boxOffice: "$24.4M",
    imgUrl:
      "https://resizing.flixster.com/Z1VFiOCKmtTnpaF1xpjv770Yhe4=/206x305/v2/https://resizing.flixster.com/M2oJAZpNF55WTowKCUlfRgUAdlw=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzMxOGQyOThiLTExYjItNDQ3Zi05MzEwLWUyZjdlYjQ1Y2FjOS53ZWJw",
    liked: false,
    reviews: [
      {
        quote: "All those disparate elements fail to gel.",
        fresh: false,
        criticName: "Mark Kermode",
        criticSource: "Kermode & Mayo's Film Review",
      },
      {
        quote:
          "While Downsizing is not not about the end of human life on earth, it confronts the prospect with minimal sentiment, and uses it to ask questions about what the good life might consist of, here and now.",
        fresh: true,
        criticName: "Henry K. Miller",
        criticSource: "Sight & Sound",
      },
      {
        quote:
          "With his latest film, Alexander Payne finds himself teetering uncomfortably atop a high-concept device and wrestling with tonal clashes.",
        fresh: true,
        criticName: "Wendy Ide",
        criticSource: "Observer (UK)",
      },
      {
        quote:
          "It offers a jumble of barely explored, quarter-baked ideas attached to a laborious plot.",
        fresh: false,
        criticName: "Deborah Ross",
        criticSource: "The Spectator",
      },
      {
        quote:
          "It starts out quick, sharp and funny and ends as a solemn and slow-moving leviathan: a movie overwhelmed by its own ecological and human implications ...",
        fresh: true,
        criticName: "Peter Bradshaw",
        criticSource: "Guardian",
      },
      {
        quote:
          "Dare we say that this once admired indie writer-director, who made Exhibition, Sideways and About Schmidt, is developing a humourless streak?",
        fresh: false,
        criticName: "Nigel Andrews",
        criticSource: "Financial Times",
      },
      {
        quote:
          "Payne stretches the film for well over two hours and never quite realizes the possibilities of his central conceit.",
        fresh: false,
        criticName: "Brian Eggert",
        criticSource: "Deep Focus Review",
      },
      {
        quote: "Medium-sized disappointment...",
        fresh: false,
        criticName: "Olly Richards",
        criticSource: "NME (New Musical Express)",
      },
      {
        quote:
          "Downsizing sticks in one's memory less because of the depth of its analysis than its slightly muddled, chaotic, well-meaning, bemused, troubled concern for humanity and its future.",
        fresh: true,
        criticName: "Joanne Laurier",
        criticSource: "World Socialist Web Site",
      },
      {
        quote: "For all its ingenuity gets bogged down in its second half.",
        fresh: true,
        criticName: "Richard Crouse",
        criticSource: "Richard Crouse",
      },
      {
        quote: "Chau's performance is the film's highlight.",
        fresh: false,
        criticName: "Richard Propes",
        criticSource: "TheIndependentCritic.com",
      },
      {
        quote:
          "[Downsizing] doesn't quite compensate for the placidity and silliness of Paul's core existential crises, or his flirtation with deterministic serendipity",
        fresh: false,
        criticName: "Luke Gorham",
        criticSource: "In Review Online",
      },
    ],
  },
  {
    slug: "black_panther_2018",
    title: "Black Panther",
    criticScore: 96,
    audienceScore: 79,
    criticsConsensus:
      "Black Panther elevates superhero cinema to thrilling new heights while telling one of the MCU's most absorbing stories — and introducing some of its most fully realized characters.",
    boxOffice: "$700.2M",
    imgUrl:
      "https://resizing.flixster.com/z27vZVXCRmpvETmdJQEW9Il7Z2Y=/206x305/v2/https://resizing.flixster.com/KBlur3LaA-y1U1yt6_Y2uO25ozA=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzMxOGI1YzBhLWMyMjEtNGUxMS1iM2Q0LWQ4OGMyYzQyZjQyYS53ZWJw",
    liked: false,
    reviews: [
      {
        quote:
          "Each man and woman...is resplendent in Ruth Carter's traditional costumes. Indigenous dialects are spoken amid the space flights, museum heists, and car chases.",
        fresh: true,
        criticName: "Jenna Marotta",
        criticSource: "indieWire",
      },
      {
        quote: '"Black Panther" lived up to the hype.',
        fresh: true,
        criticName: "Lawrence Ware",
        criticSource: "New York Times",
      },
      {
        quote:
          "You could feel like everybody felt like they were making something that they were really proud of.",
        fresh: true,
        criticName: "Mark Kermode",
        criticSource: "Kermode & Mayo's Film Review",
      },
      {
        quote:
          "But Black Panther was a moment, not just for Marvel fans and Disney stans, but it was the rare instance of a film purporting itself to be a cultural movement, and succeeding.",
        fresh: true,
        criticName: "Robert Daniels",
        criticSource: "812filmreviews",
      },
      {
        quote:
          "I want us to love on Black Panther, bravely and openly. But, we cannot forget the asterisk. We cannot forget that a significant achievement for black representation once again came on the back of forced black queer silence.",
        fresh: true,
        criticName: "Carmen Phillips",
        criticSource: "Autostraddle",
      },
      {
        quote:
          "Black Panther gives off a contemporary crackle while staying true to its roots, both African and Marvel.",
        fresh: true,
        criticName: "Michael Sragow",
        criticSource: "Film Comment Magazine",
      },
      {
        quote:
          "Marvel movies proved they could keep on evolving with Ryan Coogler's Black Panther. The 2018 film bucked the superhero formula with its Afro-futurist setting, family saga and James Bond gadgetry.",
        fresh: true,
        criticName: "Jennifer Bisset",
        criticSource: "CNET",
      },
      {
        quote:
          "A heady mix of William Shakespeare and Walt Disney -- and with a few James Bond gadgets added to sweeten the deal -- it ventures far beyond wham-bam-thank-you-Stan territory.",
        fresh: true,
        criticName: "Matt Brunson",
        criticSource: "Film Frenzy",
      },
      {
        quote:
          "[The film's] central struggle is one that you can see both sides of. It's more of a idealogical conflict than a moral one, which makes it so fascinating.",
        fresh: true,
        criticName: "Joseph Garcia",
        criticSource: "Dynamic Duel Podcast",
      },
      {
        quote:
          "Wakanda Forever is the big screen outing that has all the elements to give you a larger than life cinematic experience.",
        fresh: true,
        criticName: "Ronak Kotecha",
        criticSource: "ronakkotecha.wordpress.com",
      },
      {
        quote:
          "But “Black Panther” isn’t just a cultural statement. It’s a terrific film that energizes a genre as it has a community. Not many movies can say that.",
        fresh: true,
        criticName: "Keith Garlington",
        criticSource: "Keith & the Movies",
      },
      {
        quote: "Black Panther feels as much like a moment as it does a movie.",
        fresh: true,
        criticName: "Tony Black",
        criticSource: "Cultural Conversation",
      },
    ],
  },
  {
    slug: "a_fantastic_woman",
    title: "A Fantastic Woman",
    criticScore: 94,
    audienceScore: 76,
    criticsConsensus:
      "Subtle and tender, A Fantastic Woman handles its timely, sensitive subject matter with care.",
    boxOffice: "$2.0M",
    imgUrl:
      "https://resizing.flixster.com/x42hZM6Wr-CZvf5Ib4EZG7CKVms=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/NowShowing/177573/177573_aa.jpg",
    liked: false,
    reviews: [
      {
        quote: "[Daniela] Vega is mesmerizing as the protagonist.",
        fresh: true,
        criticName: "J. R. Jones",
        criticSource: "Chicago Reader",
      },
      {
        quote:
          "Vega's performance is riveting, but writer and co-director Sebastián Leilo's use of sex and gender to shape his narrative is straight out of a '50s melodrama.",
        fresh: false,
        criticName: "Scott Marks",
        criticSource: "San Diego Reader",
      },
      {
        quote:
          "The picture works as an extended scream against lazy assumptions and blinkered bigotry. But it is also light, funny, wry and inspiring.",
        fresh: true,
        criticName: "Donald Clarke",
        criticSource: "Irish Times",
      },
      {
        quote:
          "An accomplished and deeply moving film, gloriously rendered with shifting harmonies, gusto, poise and heartfelt emotion.",
        fresh: true,
        criticName: "Maria M. Delgado",
        criticSource: "Sight & Sound",
      },
      {
        quote:
          "A Fantastic Woman asks us to embrace all things fluid and, thanks to the superstar at its centre, it's a pleasure to go with the flow.",
        fresh: true,
        criticName: "Charlotte O'Sullivan",
        criticSource: "London Evening Standard",
      },
      {
        quote:
          "The director's empathy for the indignities of female solitude remains very much his strong suit.",
        fresh: true,
        criticName: "Tim Robey",
        criticSource: "Daily Telegraph (UK)",
      },
      {
        quote:
          "A tough look at what the trans community experience on a daily basis. Marina's inner strength, self-love, and maturity are admirable and empowering.",
        fresh: true,
        criticName: "Rosa Parra",
        criticSource: "Latinx Lens",
      },
      {
        quote:
          "a delicate strain of surrealism worked through the film that graces us with some of the most transfixing moments",
        fresh: true,
        criticName: "Jason Adams",
        criticSource: "My New Plaid Pants",
      },
      {
        quote:
          "This poignant tale of grief, loss and societal alienation is directed with warmth and sensitivity by Sebastian Lelio, and is both powerful cultural statement and emotionally involving human drama.",
        fresh: true,
        criticName: "Nikki Baughan",
        criticSource: "AWFJ.org",
      },
      {
        quote:
          "An outstanding portrait of bravery and resilience in the face of unconscionable bigotry.",
        fresh: true,
        criticName: "Betsy Bozdech",
        criticSource: "AWFJ.org",
      },
      {
        quote:
          "Chilean transgender actress Daniela Vega grabs us by the heart and doesn't let go.",
        fresh: true,
        criticName: "Anne Brodie",
        criticSource: "AWFJ.org",
      },
      {
        quote:
          "A Fantastic Woman delivers insight and elicits compassion from audiences of all genders.",
        fresh: true,
        criticName: "Jennifer Merin",
        criticSource: "AWFJ.org",
      },
    ],
  },
  {
    slug: "father_figures_2017",
    title: "Father Figures",
    criticScore: 17,
    audienceScore: 25,
    criticsConsensus:
      "Success has many fathers, but failure is Father Figures.",
    boxOffice: "$16.8M",
    imgUrl:
      "https://resizing.flixster.com/6qyKYJ1K22sURkn4bpzzbhQu4jU=/206x305/v2/https://resizing.flixster.com/ZzqvydCSmT57uK8iYKFCj0Q6Jcg=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzdkYmZiZjFkLWFjYzMtNDdkZS1iOTFlLTg5MjU4ZDhjNWM3ZC53ZWJw",
    liked: false,
    reviews: [
      {
        quote: "Come back, Daddy's Home 2; all is forgiven!",
        fresh: false,
        criticName: "Tara Brady",
        criticSource: "Irish Times",
      },
      {
        quote:
          "Offensive, amateurish and should be avoided, then forgotten. Who's the Daddy? Who cares?",
        fresh: false,
        criticName: "Linda Marric",
        criticSource: "HeyUGuys",
      },
      {
        quote:
          "Limp jokes, bad chemistry and the least believable onscreen fraternal bond make for a very lacklustre viewing experience.",
        fresh: false,
        criticName: "Eve Barlow",
        criticSource: "Empire Magazine",
      },
      {
        quote:
          "None of the pieces comfortably fit with any of the ones that sit alongside of them. Worse, it's just didn't make me laugh, and for a holiday comedy that just might be the most unfortunate misstep of them all.",
        fresh: false,
        criticName: "Sara Michelle Fetters",
        criticSource: "MovieFreak.com",
      },
      {
        quote:
          "It's not that Father Figures is irredeemably bad. It's that it's so predictable and yet so tonally disjointed.",
        fresh: false,
        criticName: "Richard Whittaker",
        criticSource: "Austin Chronicle",
      },
      {
        quote:
          "The film, which finished shooting more than two years ago before spending endless months without a release date, is both meandering and bloated, suggesting the Frankensteinian result of brutal test screenings.",
        fresh: false,
        criticName: "Eric Henderson",
        criticSource: "Slant Magazine",
      },
      {
        quote:
          "It's difficult to ascertain what's harder to take in this laugh-free comedy: the sentimental bits or the expected dashes of witless crudity.",
        fresh: false,
        criticName: "Matt Brunson",
        criticSource: "Film Frenzy",
      },
      {
        quote:
          "[It's] fueled on the fumes of jokes that maybe could have passed in the early 2000s. In what's almost 2018, the blandness that it bleeds makes it as boring as it is unfunny.",
        fresh: false,
        criticName: "Matt Cipolla",
        criticSource: "Film Monthly",
      },
      {
        quote:
          "Father Figures isn't an inherently bad movie, it just suffers from a serious identity crisis.",
        fresh: false,
        criticName: "Louisa Moore",
        criticSource: "Screen Zealots",
      },
      {
        quote:
          "One thing is for certain, in the case of Father Figures, (parental) anonymity would have been best for everyone involved.",
        fresh: false,
        criticName: "Frank Ochieng",
        criticSource: "The Critical Movie Critics",
      },
      {
        quote:
          "Oh Warner Bros. R-rated comedies, you used to be my guilty pleasure, but now you're my mortal enemy.",
        fresh: false,
        criticName: "Rendy Jones",
        criticSource: "Rendy Reviews",
      },
      {
        quote:
          "A movie entirely without consequence, about people we don't care much for, a plot of impossible silliness, and situations that seem hauled through the grinder of exhausted mid-tempo farce.",
        fresh: false,
        criticName: "David Keyes",
        criticSource: "Cinemaphile.org",
      },
    ],
  },
  {
    slug: "early_man",
    title: "Early Man",
    criticScore: 80,
    audienceScore: 49,
    criticsConsensus:
      "Early Man isn't quite as evolved as Aardman's best work, but still retains the unique visuals and sweet humor that have made the studio a favorite among animation enthusiasts.",
    boxOffice: "$8.2M",
    imgUrl:
      "https://resizing.flixster.com/JpY3Rhy5zk5R-mIh4u7nI9JgGrY=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p14462566_p_v8_aa.jpg",
    liked: false,
    reviews: [
      {
        quote:
          "Early Man is mostly the same for Aardman Animations: a little eccentric, a little erratic, equally hilarious and gross visually, and consistently amusing.",
        fresh: true,
        criticName: "Roxana Hadadi",
        criticSource: "Punch Drunk Critics",
      },
      {
        quote:
          "A generally wholesome and entertaining confection. The animation is state-of-the-art, but the simple plot mechanics and often rather tired jokes could have benefited from some rewriting.",
        fresh: true,
        criticName: "David Stratton",
        criticSource: "The Australian",
      },
      {
        quote:
          "Aardman has always done this layering of humour, so that adults can enjoy their stories as much as children, but this one pushes the volume up to 11. The glee runneth over from the first shot.",
        fresh: true,
        criticName: "Paul Byrnes",
        criticSource: "Sydney Morning Herald",
      },
      {
        quote:
          "The story is thin, allowing little room for imaginative engagement, and the comedy uninspired. Early Man contains a nice anti-sexism message, but delivers it half-heartedly.",
        fresh: false,
        criticName: "Ben Sachs",
        criticSource: "Chicago Reader",
      },
      {
        quote:
          "Early Man is not so much a return to form as it is a long overdue comeback -- and a welcome one at that.",
        fresh: true,
        criticName: "David Sims",
        criticSource: "The Atlantic",
      },
      {
        quote:
          "Early Man may not have the punch or pizzazz of a mainstream Hollywood cartoon feature, but it has a tangible charm all its own. As a fan, I wouldn't have it any other way.",
        fresh: true,
        criticName: "Leonard Maltin",
        criticSource: "leonardmaltin.com",
      },
      {
        quote:
          "The productions wit resides in its cultural distinction and commentary on football, and the restlessness of the children in the theater was not enough to dissuade me from appreciating the subtle humor of Early Man.",
        fresh: true,
        criticName: "Brian Eggert",
        criticSource: "Deep Focus Review",
      },
      {
        quote:
          "Early Man's non-verbal warthog has more screen time than any female character.",
        fresh: false,
        criticName: "Andrew Lim",
        criticSource: "Mediaversity Reviews",
      },
      {
        quote: "A witty and warm-hearted romp.",
        fresh: true,
        criticName: "Matt Brunson",
        criticSource: "Film Frenzy",
      },
      {
        quote:
          "Directed by Nick Park and written by Mark Burton and James Higginson, the film celebrates kindness, family and teamwork. It also sends the message that greed will get you nowhere.",
        fresh: true,
        criticName: "Hosea Rupprecht",
        criticSource: "Catholic News Service",
      },
      {
        quote:
          "It's silly stuff, part Flintstones, part kiddie Quest for Fire , and while it does contain quite a few laughs it doesn't have the same anarchic spirit of earlier Aardman films.",
        fresh: true,
        criticName: "Richard Crouse",
        criticSource: "Richard Crouse",
      },
      {
        quote:
          "An adventure that holds little in the way of surprises but is still a fun, sweet and enjoyable ride through Aardman's prehistoric valley.",
        fresh: true,
        criticName: "Andrew Gaudion",
        criticSource: "THN",
      },
    ],
  },
];
