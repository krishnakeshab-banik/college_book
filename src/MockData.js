// College Book Mock Database

export const initialActiveFriends = [
  {
    id: 'ananya',
    name: 'Ananya Iyer',
    university: 'IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: 'online',
    statusText: 'Online',
    sharedCount: 78,
    bio: 'Passionate photographer & amateur guitarist. Hostel 4 rules!',
    replies: [
      "Hey Aditya! Yes, that Spiti trip was epic. We should definitely edit the album together!",
      "I'm working on the farewell video right now. Do you have the photos from the campfire?",
      "Let's meet up at the canteen in 10 mins? Need to discuss the Sports Meet designs.",
      "Aha, those hostel diaries photos are so embarrassing! Please keep them in the private folder! 😂"
    ]
  },
  {
    id: 'rohan',
    name: 'Rohan Verma',
    university: 'IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'online',
    statusText: 'Online',
    sharedCount: 142,
    bio: 'Coding by night, sleeping through morning lectures. Goa 2K24 MVP.',
    replies: [
      "Yo! The Goa photos are finally up. Check out the featured album on the home page!",
      "Bro, who added that picture of me sleeping in the bus? 😂",
      "Are we planning the trek next weekend or what?",
      "Code is compiling, let me know if you need help with the yearbook site."
    ]
  },
  {
    id: 'karthik',
    name: 'Karthik Iyer',
    university: 'NIT Trichy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'call',
    statusText: 'In a call 📞',
    sharedCount: 56,
    bio: 'Tech enthusiast. Basketball captain. Live, laugh, layout.',
    replies: [
      "Hey man! Can't talk right now, in a sync call with the fest coordinators.",
      "Did you see the final score of the match? We won by 12 points!",
      "Let's upload the trophy celebration photos tonight."
    ]
  },
  {
    id: 'diya',
    name: 'Diya Sharma',
    university: 'IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'active-5m',
    statusText: 'Active 5m ago',
    sharedCount: 94,
    bio: 'Dance team lead. Coffee addict. Living my best life.',
    replies: [
      "OMG the concert pictures came out amazing! Thanks for uploading them!",
      "Are we doing the rehearsals tomorrow at the seminar hall?",
      "Haha, yes! Best night of the semester hands down."
    ]
  },
  {
    id: 'simran',
    name: 'Simran Kaur',
    university: 'Delhi University',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    status: 'active-1h',
    statusText: 'Active 1h ago',
    sharedCount: 38,
    bio: 'Exploring valleys & writing poetry. Eco club president.',
    replies: [
      "Hey! The Spiti Valley album has some breathtaking views. Take a look!",
      "I will upload my travel notes in the album comments section.",
      "See you at graduation! Can't believe these 4 years flew by so fast."
    ]
  }
];

export const initialStories = [
  {
    id: 'add-story',
    name: 'Add Story',
    isAdd: true,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'user-story',
    name: 'Your Story',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    glow: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    slides: [
      {
        url: '/assets/hostel_life.png',
        caption: 'Late night coding sprints in Hostel 4 💻🔥',
        timestamp: '2h ago'
      },
      {
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        caption: 'Canteen food runs! Best chai ever.',
        timestamp: '1h ago'
      }
    ]
  },
  {
    id: 'campus-vibes',
    name: 'Campus Vibes',
    avatar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=150&q=80',
    glow: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    slides: [
      {
        url: '/assets/campus_fest.png',
        caption: 'The main campus is glowing tonight! 🎆',
        timestamp: '4h ago'
      }
    ]
  },
  {
    id: 'goa-trip-story',
    name: 'Goa Trip 2K24',
    avatar: '/assets/goa_trip.png',
    glow: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
    slides: [
      {
        url: '/assets/goa_trip.png',
        caption: 'Sunset vibes at the beach! 🌅🌴 #Goa2K24',
        timestamp: '6h ago'
      },
      {
        url: '/assets/campfire.png',
        caption: 'Singing songs around the bonfire at midnight 🎶✨',
        timestamp: '5h ago'
      }
    ]
  },
  {
    id: 'fest-moments',
    name: 'Fest Moments',
    avatar: '/assets/campus_fest.png',
    glow: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    slides: [
      {
        url: '/assets/campus_fest.png',
        caption: 'Rock show at the college grounds! Absolute fire! 🔥🎸',
        timestamp: '8h ago'
      }
    ]
  },
  {
    id: 'hostel-diaries',
    name: 'Hostel Diaries',
    avatar: '/assets/hostel_life.png',
    glow: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    slides: [
      {
        url: '/assets/hostel_life.png',
        caption: 'Midterm prep or pizza party? You decide! 🍕📚',
        timestamp: '12h ago'
      }
    ]
  },
  {
    id: 'farewell-night',
    name: 'Farewell Night',
    avatar: '/assets/graduation.png',
    glow: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
    slides: [
      {
        url: '/assets/graduation.png',
        caption: 'Seniors leaving, tears and smiles all around. 🎓❤️',
        timestamp: '1d ago'
      }
    ]
  },
  {
    id: 'sports-meet',
    name: 'Sports Meet',
    avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=150&q=80',
    glow: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    slides: [
      {
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
        caption: 'Won the championship trophy! We did it, team! 🏆🏀',
        timestamp: '2d ago'
      }
    ]
  }
];

export const initialFeaturedMemory = {
  id: 'goa-trip-2k24',
  title: 'Goa Trip 2K24',
  subtitle: 'Featured Memory',
  location: 'Goa, India',
  dates: 'May 10 – May 15, 2024',
  memoryCount: 128,
  image: '/assets/goa_trip.png',
  contributors: [
    { name: 'Rohan Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
    { name: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
    { name: 'Diya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' },
    { name: 'Karthik Iyer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' }
  ],
  likes: 482,
  hasLiked: false,
  comments: [
    { user: 'Rohan Verma', text: 'Literally the best 5 days of my life! Let us repeat this next year.' },
    { user: 'Ananya Iyer', text: 'The sunset at Vagator beach was magical. Thanks for capturing this, Aditya!' }
  ]
};

export const initialMoments = [
  {
    id: 'moment-1',
    user: {
      name: 'Diya Sharma',
      university: 'IIT Bombay',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    timestamp: '2h ago',
    image: '/assets/campus_fest.png',
    likes: 142,
    commentsCount: 12,
    hasLiked: false,
    hasBookmarked: false,
    description: 'Throwback to the electric energy of the main concert stage! Rock on! 🎸⚡ #CampusVibes #Fest2024'
  },
  {
    id: 'moment-2',
    user: {
      name: 'Karthik Iyer',
      university: 'NIT Trichy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    timestamp: '4h ago',
    image: '/assets/campfire.png',
    likes: 97,
    commentsCount: 8,
    hasLiked: false,
    hasBookmarked: false,
    description: 'Campfire stories, cold mountain breeze, and endless laughter. Nothing beats this. 🪵🔥 #HostelDiaries #Trips'
  },
  {
    id: 'moment-3',
    user: {
      name: 'Simran Kaur',
      university: 'Delhi University',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    },
    timestamp: '8h ago',
    image: '/assets/lake_view.png',
    likes: 215,
    commentsCount: 24,
    hasLiked: false,
    hasBookmarked: false,
    description: 'Peace is a place in the mountains. Spiti valley has my heart forever! 🏔️💧 #SpitiValley #Explore'
  }
];

export const initialAlbums = [
  {
    id: 'goa-trip-2k24',
    title: 'Goa Trip 2K24',
    description: 'Summer road trip and beach party with the gang. Captured sunsets, scuba diving, and scooter races.',
    category: 'Trips',
    location: 'Goa, India',
    dates: 'May 10 – May 15, 2024',
    coverImage: '/assets/goa_trip.png',
    contributorCount: 18,
    isJoined: true,
    contributors: [
      { name: 'Aditya Verma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80' },
      { name: 'Rohan Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
      { name: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
      { name: 'Diya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' }
    ],
    media: [
      { url: '/assets/goa_trip.png', caption: 'Scooter rides in South Goa 🛵', addedBy: 'Rohan Verma' },
      { url: '/assets/campfire.png', caption: 'A cloudy midnight bonfire beach session 🌌', addedBy: 'Ananya Iyer' },
      { url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80', caption: 'Fort Aguada sightseeing!', addedBy: 'Karthik Iyer' }
    ]
  },
  {
    id: 'campus-fest-2024',
    title: 'Tech Fest & Concert 2024',
    description: 'Annual cultural and technical festival. Hackathons, robo-wars, and the final EDM concert night.',
    category: 'Festivals',
    location: 'Campus Ground',
    dates: 'March 14 – March 17, 2024',
    coverImage: '/assets/campus_fest.png',
    contributorCount: 42,
    isJoined: true,
    contributors: [
      { name: 'Aditya Verma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80' },
      { name: 'Karthik Iyer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
      { name: 'Diya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' }
    ],
    media: [
      { url: '/assets/campus_fest.png', caption: 'Opening concert by the rock band! 🎸🔥', addedBy: 'Diya Sharma' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', caption: 'Hackathon coding till 4 AM! 🖥️', addedBy: 'Aditya Verma' }
    ]
  },
  {
    id: 'hostel-diaries',
    title: 'Hostel Diaries (Wing 4B)',
    description: 'Late night study groups, gaming sessions, birthday bumps, canteen charts, and general chaos in Hostel 4.',
    category: 'Hostel',
    location: 'Hostel 4, Wing B',
    dates: 'Academic Year 2023 - 2024',
    coverImage: '/assets/hostel_life.png',
    contributorCount: 15,
    isJoined: true,
    contributors: [
      { name: 'Aditya Verma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80' },
      { name: 'Rohan Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
      { name: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' }
    ],
    media: [
      { url: '/assets/hostel_life.png', caption: 'Maggi cooking experiments at 2 AM 🍜', addedBy: 'Rohan Verma' },
      { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80', caption: 'Console gaming showdown in Room 204! 🎮', addedBy: 'Aditya Verma' }
    ]
  },
  {
    id: 'spiti-valley-road-trip',
    title: 'Spiti Valley Road Trip',
    description: 'Joint trip organized by the travel club. High-altitude passes, ancient monasteries, and freezing temperatures.',
    category: 'Trips',
    location: 'Himachal Pradesh, India',
    dates: 'October 2 – October 8, 2024',
    coverImage: '/assets/lake_view.png',
    contributorCount: 21,
    isJoined: false,
    contributors: [
      { name: 'Simran Kaur', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80' }
    ],
    media: [
      { url: '/assets/lake_view.png', caption: 'Standing tall at Chandratal Lake 🏔️💎', addedBy: 'Simran Kaur' }
    ]
  }
];

export const timelineEvents = [
  {
    id: 'time-1',
    year: '2022',
    term: 'Semester 1',
    title: 'Welcome to Campus 🎒',
    description: 'Freshers orientation, getting lost looking for lecture hall 3, and room allotment in Hostel 4. The journey begins!',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    tags: ['Hostel', 'Milestone']
  },
  {
    id: 'time-2',
    year: '2023',
    term: 'Semester 3',
    title: 'Tech Fest Organization 💻',
    description: 'Aditya got selected for the coding team. Designed the main fest website and organized the campus Hackathon.',
    image: '/assets/campus_fest.png',
    tags: ['Festivals', 'Achievement']
  },
  {
    id: 'time-3',
    year: '2024',
    term: 'Semester 5',
    title: 'Goa Summer Trip 2K24 🌴',
    description: 'Rented 10 scooters, explored Fort Aguada, sat on top of the vintage van at sunset, and sang campfire songs till dawn.',
    image: '/assets/goa_trip.png',
    tags: ['Trips', 'Milestone']
  },
  {
    id: 'time-4',
    year: '2025',
    term: 'Semester 7',
    title: 'Pre-Placement Offers 🎉',
    description: 'After months of coding sprints and group studies in the hostel lobby, bagged a placement offer. Party at the local diner!',
    image: '/assets/hostel_life.png',
    tags: ['Hostel', 'Achievement']
  },
  {
    id: 'time-5',
    year: '2026',
    term: 'Semester 8',
    title: 'Graduation Ceremony 🎓',
    description: 'Tossed our caps high in the air. 4 years of friendships, midterms, trips, and memories sealed forever. Farewell, campus!',
    image: '/assets/graduation.png',
    tags: ['Milestone', 'Farewell']
  }
];

export const initialMessages = {
  ananya: [
    { sender: 'them', text: 'Hey Aditya! Did you check out the Spiti Valley album pictures Simran posted?', time: 'Yesterday' },
    { sender: 'me', text: 'Yeah, they look absolutely breathtaking. Should we join and collaborate?', time: 'Yesterday' },
    { sender: 'them', text: 'For sure! Let me request access. Also, did you edit the Goa trip reel?', time: '10:30 AM' },
    { sender: 'me', text: 'Almost done. Just need your audio recording from that campfire jam session.', time: '10:32 AM' },
    { sender: 'them', text: 'Ah, I will send it right away. It is a bit noisy but hopefully works!', time: '10:35 AM' }
  ],
  rohan: [
    { sender: 'them', text: 'Bro! Who added that picture of me sleeping on the bus to Goa? 💀', time: 'Wednesday' },
    { sender: 'me', text: 'LMAO it was Diya! That photo is legendary.', time: 'Wednesday' },
    { sender: 'them', text: 'I am going to get revenge at the farewell party, just wait.', time: 'Wednesday' },
    { sender: 'me', text: 'Can\'t wait! Are we gaming tonight?', time: '9:15 PM' },
    { sender: 'them', text: 'Yes, Room 204. FIFA night, bring the extra controller!', time: '9:20 PM' }
  ],
  karthik: [
    { sender: 'me', text: 'Hey Karthik, did you submit the sports album photos?', time: '2 days ago' },
    { sender: 'them', text: 'Yeah, uploaded 15 action shots from the basketball finals. Check it out.', time: '2 days ago' },
    { sender: 'me', text: 'Awesome, they look super clean. Thanks!', time: '2 days ago' }
  ]
};
