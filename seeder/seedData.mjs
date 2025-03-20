import dotenv from "dotenv";

dotenv.config({ path: process.cwd() + "/.env.local" });

let url = process.env.NEXT_PUBLIC_URL;

const seedData = {
  settings: {
    name: "Next Life",
    currency: { name: "USD", symbol: "$", exchangeRate: 1 },
    title: "Ecommerce Shopping Platform",
    address: "1605 Bottom Lane, Tonawanda, New York 14151",
    email: "info@nextlife.com",
    shortAddress: "12 Swanson St. New York",
    social: {
      facebook: "https://www.facebook.com",
      instagram: "https://www.instagram.com",
      twitter: "https://www.twitter.com",
      youtube: "https://www.youtube.com",
      pinterest: "https://www.pinterest.com",
    },
    phoneFooter: "+1 325 268 2584",
    phoneHeader: "+1 325 268 2584",
    copyright: "© 2024 - NEXT LIFE™",
    favicon: [
      {
        name: "fav.png",
        url: `${url}/fav.png`,
      },
    ],
    gatewayImage: [
      {
        name: "gateway.png",
        url: `${url}/gateway.png`,
      },
    ],
    logo: [
      {
        name: "logo.png",
        url: `${url}/logo.png`,
      },
    ],
    seo: {
      description: "demo",
      image: [
        {
          name: "fav.png",
          url: `${url}/fav.png`,
        },
      ],
      keyword: "demo,demo,demo",
      title: "next life",
    },
    footerCustomScript: "",
    headerCustomScript: "",
    footerBanner: {
      security: {
        title: "MONEY BACK GUARANTEE",
        description: "Lorem ipsum dolor sit amet consectetur",
      },
      support: {
        title: "24/7 CUSTOMER SUPPORT",
        description: "Lorem ipsum dolor sit amet consectetur",
      },
      delivery: {
        title: "FAST AND LOW COST DELIVERY",
        description: "Lorem ipsum dolor sit amet consectetur",
      },
    },
    color: {
      primary: "#D70021",
      primary_hover: "#f6376b",
      secondary: "#00c466",
      body_gray: "#dde8e3",
      body_gray_contrast: "#333333",
      primary_contrast: "#ffffff",
      primary_hover_contrast: "#333333",
      secondary_contrast: "#ffffff",
    },
    paymentGateway: {
      cod: true,
      paypal: false,
      stripe: false,
      sslCommerz: false,
    },
    script: {
      googleSiteVerificationId: "",
      facebookAppId: "",
      googleAnalyticsId: "",
      facebookPixelId: "",
      messengerPageId: "",
    },
    description: "Lorem ipsum dolor sit amet conse ela di mos.",
  },
  product: [
    {
      name: "Starbucks Vanilla Latte",
      slug: "starbucks-vanilla-latte-4147iycj1117rjzr",
      productId: "P5550OFYH6546ITHQ",
      unit: "lb",
      unitValue: "2",
      price: 40,
      discount: 40,
      description:
        '<h1><span style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; font-size: 18px; display: inline !important;">Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffea species.&nbsp;</span></h1><h2><span style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;; font-size: 13px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><strong>The genus Coffea is native to tropical Africa (specifically having its origin in Ethiopia and Sudan) and Madagascar, the Comoros, Mauritius, and Réunion in the Indian Ocean.</strong></span></h2>',
      type: "simple",
      image: [
        {
          name: "starbucks_vanilla_latte.jpg",
          url: `${url}/starbucks_vanilla_latte.jpg`,
        },
      ],
      gallery: [
        {
          name: "starbucks_vanilla_latte.jpg",
          url: `${url}/starbucks_vanilla_latte.jpg`,
        },
      ],
      categories: ["beverage"],
      subcategories: ["coffee"],
      trending: true,
      quantity: 100,
      sku: "Starbucks-Vanilla-Latte",
      colors: [],
      attributes: [],
      variants: [],
      bestSelling: true,
      new: false,
      seo: {
        title: "",
        description: "",
        image: [],
      },
      shortDescription:
        "Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffea species. The genus Coffea is native to tropical Africa (specifically having its origin in Ethiopia and Sudan) and Madagascar, the Comoros, Mauritius, and Réunion in the Indian Ocean.",
    },
    {
      name: "Febreze Air Bora Bora Water",
      slug: "febreze-air-bora-bora-water-6333rgzs8333fzef",
      productId: "P3383SUSU3330EFNG",
      unit: "oz",
      unitValue: "8.8",
      price: 60,
      discount: 58.8,
      description: "<p><br></p>",
      type: "variable",
      image: [
        {
          name: "fabreze.jpg",
          url: `${url}/fabreze.jpg`,
        },
      ],
      gallery: [
        {
          name: "fabreze.jpg",
          url: `${url}/fabreze.jpg`,
        },
      ],
      categories: ["home-and-cleaning"],
      subcategories: ["air-freshener"],
      trending: false,
      new: true,
      bestSelling: true,
      colors: [
        {
          label: "Turquoise",
          value: "#40e0d0",
        },
        {
          label: "Lemon Yellow",
          value: "#Fff44f",
        },
        {
          label: "Spring Green",
          value: "#00ff7f",
        },
      ],
      attributes: [],
      variants: [
        {
          color: "Turquoise",
          attr: null,
          price: "0",
          sku: "101",
          qty: "100",
        },
        {
          color: "Lemon Yellow",
          attr: null,
          price: "0",
          sku: "102",
          qty: "100",
        },
        {
          color: "Spring Green",
          attr: null,
          price: "1",
          sku: "103",
          qty: "-1",
        },
      ],
      attributeIndex: "",
      seo: {
        title: "Febreze Air Bora Bora Water",
        description:
          "Air fresheners are consumer products that typically emit fragrance and are used in homes or commercial interiors such as restrooms, foyers, hallways, vestibules and other smaller indoor areas, as well as larger areas such as hotel lobbies, auto dealerships, medical facilities, public arenas and other large interior spaces.",
        image: [
          {
            name: "fabreze.jpg",
            url: `${url}/fabreze.jpg`,
          },
        ],
      },
      shortDescription:
        "Air fresheners are consumer products that typically emit fragrance and are used in homes or commercial interiors such as restrooms, foyers, hallways, vestibules and other smaller indoor areas, as well as larger areas such as hotel lobbies, auto dealerships, medical facilities, public arenas and other large interior spaces.",
    },
    {
      name: "Cloetta Choco Waffle Crispy",
      slug: "cloetta-choco-waffle-crispy-4850ciny4488oaqb",
      productId: "P2339DBGU3332BLKI",
      unit: "pc(s)",
      unitValue: "1",
      price: 22,
      discount: 21.5,
      description: "<p><br></p>",
      type: "simple",
      image: [
        {
          name: "Cloetta.jpg",
          url: `${url}/Cloetta.jpg`,
        },
      ],
      gallery: [
        {
          name: "Cloetta.jpg",
          url: `${url}/Cloetta.jpg`,
        },
      ],
      categories: ["snacks"],
      subcategories: ["chocolates"],
      trending: true,
      new: true,
      bestSelling: true,
      quantity: 8,
      sku: "Cloetta-110",
      colors: [],
      attributes: [],
      variants: [],
      seo: {
        title: "",
        description: "",
        image: [],
      },
      shortDescription:
        "Chocolate is a usually sweet, brown food preparation of roasted and ground cacao seeds that is made in the form of a liquid, paste, or in a block, or used as a flavouring ingredient in other foods.",
    },
    {
      name: "Magnetic Designs Women Printed Fit And Flare Dress",
      slug: "magnetic-designs-women-printed-fit-and-flare-dress-2599zfmm5905rtuy",
      productId: "P3080ZOBV4343OEQP",
      unit: "pc(s)",
      unitValue: "1",
      price: 350,
      discount: 350,
      description: "",
      type: "variable",
      image: [
        {
          name: "Magnetic.jpg",
          url: `${url}/Magnetic.jpg`,
        },
      ],
      gallery: [
        {
          name: "Magnetic.jpg",
          url: `${url}/Magnetic.jpg`,
        },
      ],
      categories: ["clothing-and-fashion"],
      subcategories: ["women-clothing"],
      trending: true,
      new: true,
      bestSelling: false,
      colors: [
        {
          label: "Blue Violet",
          value: "#8a2be2",
        },
        {
          label: "Electric Purple",
          value: "#Bf00ff",
        },
        {
          label: "Rose Pink",
          value: "#e8909c",
        },
      ],
      attributes: [
        {
          label: "XL",
          value: "XL",
          for: "Size",
        },
        {
          label: "L",
          value: "L",
          for: "Size",
        },
        {
          label: "M",
          value: "M",
          for: "Size",
        },
      ],
      variants: [
        {
          color: "Blue Violet",
          attr: "XL",
          price: "0",
          sku: "101",
          qty: 96,
        },
        {
          color: "Blue Violet",
          attr: "L",
          price: "0",
          sku: "102",
          qty: "100",
        },
        {
          color: "Blue Violet",
          attr: "M",
          price: "0",
          sku: "103",
          qty: "100",
        },
        {
          color: "Electric Purple",
          attr: "XL",
          price: "1",
          sku: "104",
          qty: "10",
        },
        {
          color: "Electric Purple",
          attr: "L",
          price: "1",
          sku: "105",
          qty: "11",
        },
        {
          color: "Electric Purple",
          attr: "M",
          price: "2",
          sku: "106",
          qty: "15",
        },
        {
          color: "Rose Pink",
          attr: "XL",
          price: "3",
          sku: "107",
          qty: 10,
        },
        {
          color: "Rose Pink",
          attr: "L",
          price: "4",
          sku: "108",
          qty: 19,
        },
        {
          color: "Rose Pink",
          attr: "M",
          price: "1",
          sku: "109",
          qty: "22",
        },
      ],
      attributeIndex: "0",
      seo: {
        title: "Magnetic Designs Women Printed Fit And Flare Dress",
        description:
          "Mauve printed knitted fit and flare dress, has a round neck, three-quarter sleeves, concealed zip closure,, flared hem",
        image: [
          {
            name: "Magnetic.jpg",
            url: `${url}/Magnetic.jpg`,
          },
        ],
      },
      shortDescription:
        "Mauve printed knitted fit and flare dress, has a round neck, three-quarter sleeves, concealed zip closure. flared hem",
    },
    {
      name: "Jammie Dodgers",
      slug: "jammie-dodgers-6555nvio0665otyj",
      productId: "P4444HNVC9272ZDLV",
      unit: "pc(s)",
      unitValue: "1",
      price: 12,
      discount: 12,
      description: "",
      type: "simple",
      image: [
        {
          name: "Jammie.jpg",
          url: `${url}/Jammie.jpg`,
        },
      ],
      gallery: [
        {
          name: "Jammie.jpg",
          url: `${url}/Jammie.jpg`,
        },
      ],
      categories: ["snacks"],
      subcategories: ["biscuits"],
      trending: true,
      new: true,
      bestSelling: true,
      quantity: 80,
      sku: "101",
      colors: [],
      attributes: [],
      variants: [],
      seo: {
        title: "Jammie Dodgers Biscuit",
        description:
          "Jammie Dodgers biscuit is a flour-based baked food product. This article covers the type of biscuit found in Africa, Asia, and Europe, which is typically hard, flat, and unleavened.",
        image: [
          {
            name: "Jammie.jpg",
            url: `${url}/Jammie.jpg`,
          },
        ],
      },
      shortDescription:
        "A biscuit is a flour-based baked food product. This article covers the type of biscuit found in Africa, Asia, and Europe, which is typically hard, flat, and unleavened.",
    },
  ],
  category: [
    {
      categoryId: "41td48pu",
      name: "Skin Care",
      icon: [
        {
          name: "beauty-makeup.png",
          url: `${url}/beauty-makeup.png`,
        },
      ],
      slug: "skin-care",
      subCategories: [
        {
          name: "Cleansers",
          slug: "cleansers",

          child: [
            {
              name: "Foaming Cleansers",
              slug: "foaming-cleansers",
            },
            {
              name: "Gel Cleansers",
              slug: "gel-cleansers",
            },
            {
              name: "Cream Cleansers",
              slug: "cream-cleansers",
            },
          ],
        },
        {
          name: "Moisturizers",
          slug: "moisturizers",

          child: [
            {
              name: "Day Moisturizers",
              slug: "day-moisturizers",
            },
            {
              name: "Night Moisturizers",
              slug: "night-moisturizers",
            },
            {
              name: "Sunscreen Lotions",
              slug: "sunscreen-lotions",
            },
          ],
        },
        {
          name: "Serums",
          slug: "serums",

          child: [
            {
              name: "Hydrating Serums",
              slug: "hydrating-serums",
            },
            {
              name: "Anti-Aging Serums",
              slug: "anti-aging-serums",
            },
            {
              name: "Brightening Serums",
              slug: "brightening-serums",
            },
          ],
        },
        {
          name: "Sunscreen",
          slug: "sunscreen",

          child: [
            {
              name: "SPF 30",
              slug: "spf-30",
            },
            {
              name: "SPF 50",
              slug: "spf-50",
            },
            {
              name: "Water-resistant Sunscreen",
              slug: "water-resistant-sunscreen",
            },
          ],
        },
      ],
      topCategory: true,
    },
    {
      categoryId: "85xl70ao",
      name: "Fruits & Vegetables",
      icon: [
        {
          name: "frouit.png",
          url: `${url}/frouit.png`,
        },
      ],
      slug: "fruits-and-vegetables",
      subCategories: [
        {
          name: "Vegetables",
          slug: "vegetables",
        },
        {
          name: "Fruits",
          slug: "fruits",
        },
        {
          name: "Fresh Fruits",
          slug: "fresh-fruits",

          child: [
            {
              name: "Citrus Fruits",
              slug: "citrus-fruits",
            },
            {
              name: "Berries",
              slug: "berries",
            },
            {
              name: "Tropical Fruits",
              slug: "tropical-fruits",
            },
          ],
        },
        {
          name: "Fresh Vegetables",
          slug: "fresh-vegetables",

          child: [
            {
              name: "Leafy Greens",
              slug: "leafy-greens",
            },
            {
              name: "Root Vegetables",
              slug: "root-vegetables",
            },
            {
              name: "Cruciferous Vegetables",
              slug: "cruciferous-vegetables",
            },
          ],
        },
        {
          name: "Organic Produce",
          slug: "organic-produce",

          child: [
            {
              name: "Organic Fruits",
              slug: "organic-fruits",
            },
            {
              name: "Organic Vegetables",
              slug: "organic-vegetables",
            },
          ],
        },
        {
          name: "Exotic Fruits",
          slug: "exotic-fruits",

          child: [
            {
              name: "Dragon Fruit",
              slug: "dragon-fruit",
            },
            {
              name: "Kiwi",
              slug: "kiwi",
            },
            {
              name: "Passion Fruit",
              slug: "passion-fruit",
            },
          ],
        },
      ],
      topCategory: true,
    },
    {
      categoryId: "44vo84jp",
      name: "Meat & Fish",
      icon: [
        {
          name: "meat.png",
          url: `${url}/meat.png`,
        },
      ],
      slug: "meat-and-fish",
      subCategories: [
        {
          name: "Fresh Meat",
          slug: "fresh-meat",
        },
        {
          name: "Fresh Fish",
          slug: "fresh-fish",
        },
        {
          name: "Beef",
          slug: "beef",

          child: [
            {
              name: "Ground Beef",
              slug: "ground-beef",
            },
            {
              name: "Steaks",
              slug: "steaks",
            },
            {
              name: "Roasts",
              slug: "roasts",
            },
          ],
        },
        {
          name: "Chicken",
          slug: "chicken",

          child: [
            {
              name: "Whole Chicken",
              slug: "whole-chicken",
            },
            {
              name: "Chicken Breasts",
              slug: "chicken-breasts",
            },
            {
              name: "Chicken Thighs",
              slug: "chicken-thighs",
            },
          ],
        },
        {
          name: "Fish",
          slug: "fish",

          child: [
            {
              name: "Salmon",
              slug: "salmon",
            },
            {
              name: "Cod",
              slug: "cod",
            },
            {
              name: "Tilapia",
              slug: "tilapia",
            },
          ],
        },
        {
          name: "Seafood",
          slug: "seafood",

          child: [
            {
              name: "Shrimp",
              slug: "shrimp",
            },
            {
              name: "Lobster",
              slug: "lobster",
            },
            {
              name: "Crab",
              slug: "crab",
            },
          ],
        },
      ],
      topCategory: true,
    },
    {
      categoryId: "83yj85ci",
      name: "Snacks",
      icon: [
        {
          name: "snacks.png",
          url: `${url}/snacks.png`,
        },
      ],
      slug: "snacks",
      subCategories: [
        {
          name: "Biscuits",
          slug: "biscuits",

          child: [
            {
              name: "Jammie",
              slug: "jammie",
            },
          ],
        },
        {
          name: "Chocolates",
          slug: "chocolates",
        },
        {
          name: "Crisps",
          slug: "crisps",
        },
        {
          name: "Noodles",
          slug: "noodles",
        },
        {
          name: "Soup",
          slug: "soup",
        },
        {
          name: "Sauce",
          slug: "sauce",
        },
        {
          name: "Pasta",
          slug: "pasta",
        },
        {
          name: "Chips & Crisps",
          slug: "chips-and-crisps",

          child: [
            {
              name: "Potato Chips",
              slug: "potato-chips",
            },
            {
              name: "Tortilla Chips",
              slug: "tortilla-chips",
            },
            {
              name: "Veggie Chips",
              slug: "veggie-chips",
            },
          ],
        },
        {
          name: "Nuts & Seeds",
          slug: "nuts-and-seeds",

          child: [
            {
              name: "Almonds",
              slug: "almonds",
            },
            {
              name: "Pistachios",
              slug: "pistachios",
            },
            {
              name: "Sunflower Seeds",
              slug: "sunflower-seeds",
            },
            {
              name: "Butter Popcorn",
              slug: "butter-popcorn",
            },
          ],
        },
        {
          name: "Popcorn",
          slug: "popcorn",

          child: [
            {
              name: "Butter Popcorn",
              slug: "butter-popcorn",
            },
            {
              name: "Caramel Popcorn",
              slug: "caramel-popcorn",
            },
          ],
        },
        {
          name: "Energy Bars",
          slug: "energy-bars",

          child: [
            {
              name: "Protein Bars",
              slug: "protein-bars",
            },
            {
              name: "Granola Bars",
              slug: "granola-bars",
            },
          ],
        },
      ],
      topCategory: true,
    },
    {
      categoryId: "35pz15yb",
      name: "Home & Cleaning",
      icon: [
        {
          name: "Home.png",
          url: `${url}/Home.png`,
        },
      ],
      slug: "home-and-cleaning",
      subCategories: [
        {
          name: "Cleaning Products",
          slug: "cleaning-products",

          child: [
            {
              name: "Cotton Fresh",
              slug: "cotton-fresh",
            },
          ],
        },
        {
          name: "Kitchen Accessories",
          slug: "kitchen-accessories",
        },
        {
          name: "Home Decor",
          slug: "home-decor",

          child: [
            {
              name: "Wall Art",
              slug: "wall-art",
            },
            {
              name: "Decorative Pillows",
              slug: "decorative-pillows",
            },
          ],
        },
        {
          name: "Furniture",
          slug: "furniture",

          child: [
            {
              name: "Living Room Furniture",
              slug: "living-room-furniture",
            },
            {
              name: "Bedroom Furniture",
              slug: "bedroom-furniture",
            },
          ],
        },
        {
          name: "Bedding & Linens",
          slug: "bedding-and-linens",

          child: [
            {
              name: "Bed Sheets",
              slug: "bed-sheets",
            },
            {
              name: "Comforters",
              slug: "comforters",
            },
          ],
        },
        {
          name: "Kitchenware",
          slug: "kitchenware",

          child: [
            {
              name: "Cookware",
              slug: "cookware",
            },
          ],
        },
        {
          name: "Air Freshener",
          slug: "air-freshener",

          child: [
            {
              name: "Anti Tobacco",
              slug: "anti-tobacco",
            },
            {
              name: "Car Air Freshener",
              slug: "car-air-freshener",
            },
          ],
        },
      ],
      topCategory: true,
    },
    {
      categoryId: "11hb63jo",
      name: "Breakfast",
      icon: [
        {
          name: "Breakfast.png",
          url: `${url}/Breakfast.png`,
        },
      ],
      slug: "breakfast",
      subCategories: [
        {
          name: "Bread",
          slug: "bread",
        },
        {
          name: "Cereal",
          slug: "cereal",
        },
        {
          name: "Honey",
          slug: "honey",
        },
        {
          name: "Jam",
          slug: "jam",
        },
        {
          name: "Cereals",
          slug: "cereals",

          child: [
            {
              name: "Wheat Cereals",
              slug: "wheat-cereals",
            },
          ],
        },
        {
          name: "Oatmeal",
          slug: "oatmeal",

          child: [
            {
              name: "Instant Oatmeal",
              slug: "instant-oatmeal",
            },
            {
              name: "Steel-Cut Oatmeal",
              slug: "steel-cut-oatmeal",
            },
          ],
        },
        {
          name: "Pancake Mixes",
          slug: "pancake-mixes",

          child: [
            {
              name: "Wheat Cereals",
              slug: "wheat-cereals",
            },
            {
              name: "Buttermilk Pancakes",
              slug: "buttermilk-pancakes",
            },
          ],
        },
        {
          name: "Breakfast Bars",
          slug: "breakfast-bars",

          child: [
            {
              name: "Nut Bars",
              slug: "nut-bars",
            },
            {
              name: "Fruit Bars",
              slug: "fruit-bars",
            },
          ],
        },
      ],
      topCategory: true,
    },
    {
      categoryId: "85ir91yx",
      name: "Beverage",
      icon: [
        {
          name: "Beverage.png",
          url: `${url}/Beverage.png`,
        },
      ],
      slug: "beverage",
      subCategories: [
        {
          name: "Juice",
          slug: "juice",
        },
        {
          name: "Tea",
          slug: "tea",

          child: [
            {
              name: "Black Tea",
              slug: "black-tea",
            },
            {
              name: "Green Tea",
              slug: "green-tea",
            },
          ],
        },
        {
          name: "Juices",
          slug: "juices",

          child: [
            {
              name: "Fruit Juices",
              slug: "fruit-juices",
            },
            {
              name: "Vegetable Juices",
              slug: "vegetable-juices",
            },
          ],
        },
        {
          name: "Soft Drinks",
          slug: "soft-drinks",

          child: [
            {
              name: "Lemon-Lime",
              slug: "lemon-lime",
            },
            {
              name: "Cola",
              slug: "cola",
            },
          ],
        },
        {
          name: "Coffee",
          slug: "coffee",

          child: [
            {
              name: "Ground Coffee",
              slug: "ground-coffee",
            },
            {
              name: "Instant Coffee",
              slug: "instant-coffee",
            },
          ],
        },
      ],
      topCategory: true,
    },
    {
      categoryId: "52oj55bv",
      name: "Gadget",
      icon: [
        {
          name: "Gadget.png",
          url: `${url}/Gadget.png`,
        },
      ],
      slug: "gadget",
      subCategories: [
        {
          name: "Camera",
          slug: "camera",
        },
        {
          name: "Smartphones",
          slug: "smartphones",

          child: [
            {
              name: "Android Phones",
              slug: "android-phones",
            },
            {
              name: "iPhones",
              slug: "iphones",
            },
          ],
        },
        {
          name: "Laptops",
          slug: "laptops",

          child: [
            {
              name: "Windows Laptops",
              slug: "windows-laptops",
            },
            {
              name: "MacBook",
              slug: "macbook",
            },
          ],
        },
        {
          name: "Accessories",
          slug: "accessories",

          child: [
            {
              name: "Phone Cases",
              slug: "phone-cases",
            },
            {
              name: "Headphones",
              slug: "headphones",
            },
          ],
        },
        {
          name: "Wearables",
          slug: "wearables",

          child: [
            {
              name: "Smartwatches",
              slug: "smartwatches",
            },
          ],
        },
      ],
      topCategory: true,
    },
    {
      categoryId: "47qz44fd",
      name: "Clothing & Fashion",
      icon: [
        {
          name: "Clothing.png",
          url: `${url}/Clothing.png`,
        },
      ],
      slug: "clothing-and-fashion",
      subCategories: [
        {
          name: "Men's Clothing",
          slug: "men-s-clothing",

          child: [
            {
              name: "T-Shirts",
              slug: "t-shirts",
            },
            {
              name: "Jeans",
              slug: "jeans",
            },
            {
              name: "Jackets",
              slug: "jackets",
            },
          ],
        },
        {
          name: "Women's Clothing",
          slug: "women-s-clothing",

          child: [
            {
              name: "Dresses",
              slug: "dresses",
            },
            {
              name: "Tops",
              slug: "tops",
            },
            {
              name: "Sweaters",
              slug: "sweaters",
            },
          ],
        },
        {
          name: "Shoes",
          slug: "shoes",

          child: [
            {
              name: "Sneakers",
              slug: "sneakers",
            },
            {
              name: "Boots",
              slug: "boots",
            },
          ],
        },
        {
          name: "Accessories",
          slug: "accessories",

          child: [
            {
              name: "Hats",
              slug: "hats",
            },
            {
              name: "Sunglasses",
              slug: "sunglasses",
            },
          ],
        },
      ],
      topCategory: true,
    },
  ],
  attribute: {
    name: "Size",
    values: [
      { name: "XS", value: "" },
      { name: "S", value: "" },
      { name: "M", value: "" },
      { name: "L", value: "" },
      { name: "XL", value: "" },
      { name: "2XL", value: "" },
      { name: "3XL", value: "" },
      { name: "4XL", value: "" },
    ],
  },
  color: [
    {
      name: "Blue Violet",
      value: "#8a2be2",
    },
    {
      name: "Electric Purple",
      value: "#Bf00ff",
    },
    {
      name: "Royal Blue",
      value: "#4169e1",
    },
    {
      name: "Turquoise",
      value: "#40e0d0",
    },
    {
      name: "Burnt",
      value: "#E97451",
    },
    {
      name: "Lemon Yellow",
      value: "#Fff44f",
    },
    {
      name: "Spring Green",
      value: "#00ff7f",
    },
    {
      name: "Neon Orange",
      value: "#Ff6700",
    },
    {
      name: "Maroon",
      value: "#800000",
    },
    {
      name: "Rose Pink",
      value: "#e8909c",
    },
  ],
  shippingCharge: {
    area: [{ name: "Dhaka", price: 2 }],
    internationalCost: 80,
  },
  user: {
    hash: "$2b$06$M95iUsbIWVwAqJFrPlYi1eso6nT20akshHFdYa0zwb1.Fi6gyfNrm",
    salt: "$2b$06$M95iUsbIWVwAqJFrPlYi1e",
    isAdmin: true,
    email: "demo@admin.com",
    name: "Admin",
  },
  webpage: {
    aboutPage: {
      content: "<p>demo</p>",
    },
    faqPage: {
      content: "<p>demo</p>",
    },
    termsPage: {
      content: "<p>demo</p>",
    },
    privacyPage: {
      content: "<p>demo</p>",
    },
    returnPolicyPage: {
      content: "<p>demo</p>",
    },
    homePage: {
      carousel: {
        background: [
          {
            name: "bg.png",
            url: `${url}/bg.png`,
          },
        ],
        carouselData: [
          {
            title: "Accessories",
            subTitle: "Premium Quality Gadget",
            description:
              "Quisque sit amet felis feugiat, tincidunt turpis quis, tristique massa. Suspendisse potenti. Donec gravida enim et libero sollicitudin viverra.",
            url: "/gallery?category=gadget",
            image: [
              {
                name: "gad.png",
                url: `${url}/gad.png`,
              },
            ],
            id: "9990botz9090euao",
          },
          {
            title: "Skincare",
            subTitle: "Glow up your skin",
            description:
              "Quisque sit amet felis feugiat, tincidunt turpis quis, tristique massa. Suspendisse potenti. Donec gravida enim et libero sollicitudin viverra.",
            url: "/gallery?category=skin-care",
            image: [
              {
                name: "skn.png",
                url: `${url}/skn.png`,
              },
            ],
            id: "3005bhek0336dbdo",
          },
        ],
      },
      banner: {
        title: "Deal Of The Day",
        subTitle: "Save Up to 40% Off!",
        description:
          "Praesent nec finibus massa. Phasellus id auctor lacus, at iaculis lorem. Donec quis arcu elit. In vehicula purus se.Praesent nec finibus maskkgduDonec quis arcu elit. In vehicula purus se.Praesent nec finibus maskkgduylkwhfiusa ylkwhfiusa",
        url: "/gallery",
        image: [
          {
            name: "bg1.png",
            url: `${url}/bg1.png`,
          },
        ],
      },
      collection: {
        scopeA: {
          title: "Save 17% on organic Juice",
          url: "/gallery?category=gadget",
          image: [
            {
              name: "bg2.png",
              url: `${url}/bg2.png`,
            },
          ],
        },
        scopeB: {
          title: "Make your Breakfast Healthy and Easy",
          url: "/gallery?category=clothing-and-fashion",
          image: [
            {
              name: "bg3.png",
              url: `${url}/bg3.png`,
            },
          ],
        },
        scopeC: {
          title: "The best Organic Products Online",
          url: "/gallery?category=fruits-and-vegetables",
          image: [
            {
              name: "bg4.png",
              url: `${url}/bg4.png`,
            },
          ],
        },
        scopeD: {
          title: "Everyday Fresh & Clean with Our Products",
          url: "/gallery?category=skin-care",
          image: [
            {
              name: "bg5.png",
              url: `${url}/bg5.png`,
            },
          ],
        },
      },
    },
  },
};

export default seedData;
