/**
 * FlavorInfluences.js
 *
 * Defines influences of tea flavors, focusing on pairing and contextual hints.
 * Structure: Categories → Sub-categories → Hints and associated flavors
 */

export const flavorInfluences = {
    floral: {
        jasmine: {
            foodPairingHints: ["Light Desserts", "Steamed Vegetables", "White Fish", "Rice Dishes"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Relaxation", "Social", "Evening", "Unwinding"],
            associatedFlavors: ["jasmine", "honey"]
        },
        rose: {
            foodPairingHints: ["Pastries", "Fruit Salads", "Middle Eastern Sweets", "Yogurt"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Relaxation", "Social", "Romantic"],
            associatedFlavors: ["rose", "honey"]
        },
        orchid: {
            foodPairingHints: ["Creamy Desserts", "Light Cakes", "Tropical Fruit", "Subtle Pastries"],
            seasonalAffinityHints: ["Spring", "Anytime"],
            activityHints: ["Relaxation", "Contemplative", "Social"],
            associatedFlavors: ["orchid", "honey"]
        },
        lilac: {
            foodPairingHints: ["Spring Salads", "Light Fruit Tarts", "Madeleines"],
            seasonalAffinityHints: ["Spring"],
            activityHints: ["Uplifting", "Social", "Creative"],
            associatedFlavors: ["lilac", "floral"]
        },
        osmanthus: {
            foodPairingHints: ["Apricot Pastries", "Moon Cakes", "Jellies", "Light Cookies"],
            seasonalAffinityHints: ["Autumn", "Spring"],
            activityHints: ["Uplifting", "Social", "Relaxation"],
            associatedFlavors: ["apricot", "osmanthus", "honey"]
        },
        honeysuckle: {
            foodPairingHints: ["Fruit Salads", "Light Cakes", "Sorbets"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Uplifting", "Relaxation", "Social"],
            associatedFlavors: ["honeysuckle", "nectar"]
        }
    },

    fruity: {
        apple: {
            foodPairingHints: ["Cheese Plates", "Pork Dishes", "Oatmeal", "Light Cakes"],
            seasonalAffinityHints: ["Autumn", "Spring"],
            activityHints: ["Social", "Afternoon Break", "Gentle Energy"],
            associatedFlavors: ["apple", "red apple", "green apple"]
        },
        citrus: {
            foodPairingHints: ["Seafood", "Salads", "Chicken", "Light Desserts"],
            seasonalAffinityHints: ["Summer", "Spring"],
            activityHints: ["Energy", "Focus", "Morning", "Refreshment"],
            associatedFlavors: ["lemon", "orange", "grapefruit", "lime", "citrus peel"]
        },
        berry: {
            foodPairingHints: ["Desserts", "Yogurt", "Breakfast Foods", "Salads"],
            seasonalAffinityHints: ["Summer", "Spring"],
            activityHints: ["Energy", "Social", "Uplifting"],
            associatedFlavors: ["strawberry", "raspberry", "blueberry", "blackberry"]
        },
        dark_fruits: {
            foodPairingHints: ["Dark Chocolate", "Game Meats", "Roasted Meats", "Strong Cheese", "Spiced Desserts", "Rich Stews"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Evening", "Social", "Contemplative", "Relaxation"],
            associatedFlavors: ["raisin", "prune", "fig", "blackberry", "black currant", "cherry", "plum"]
        }
    },

    vegetal: {
        grassy: {
            foodPairingHints: ["Fresh Salads", "Light Vegetable Dishes", "White Fish"],
            seasonalAffinityHints: ["Spring", "Early Summer"],
            activityHints: ["Morning", "Focus", "Cleansing"],
            associatedFlavors: ["fresh cut grass", "hay", "green", "vegetal", "vegetable"]
        },
        leafy: {
            foodPairingHints: ["Salads", "Steamed Greens", "Light Soups"],
            seasonalAffinityHints: ["Spring"],
            activityHints: ["Focus", "Detox", "Cleansing"],
            associatedFlavors: ["spinach", "kale", "lettuce", "grass"]
        },
        herbaceous: {
            foodPairingHints: ["Grilled Vegetables", "Savory Pastries", "Cheese", "Soups"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Focus", "Refreshment", "Calm"],
            associatedFlavors: ["parsley", "thyme", "mint", "sage", "basil"]
        }
    },

    nutty_and_toasty: {
        nuts: {
            foodPairingHints: ["Baked Goods", "Cheese", "Roasted Vegetables", "Light Meats", "Roasted Nuts", "Hard Cheese"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Relaxation", "Focus"],
            associatedFlavors: ["almond", "hazelnut", "walnut", "chestnut", "creamy", "peanut"]
        },
        toasted: {
            foodPairingHints: ["Breakfast Foods", "Roasted Nuts", "Comfort Food", "Baked Goods", "Grilled Meats"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Routine"],
            associatedFlavors: ["bread", "grain", "barley", "rice", "toast"]
        }
    },

    spicy: {
        pungent: {
            foodPairingHints: ["Rich Desserts", "Spiced Cakes", "Curries", "Stews", "Spiced Foods"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Energy", "Digestive"],
            associatedFlavors: ["pepper", "ginger", "cinnamon", "clove", "anise", "licorice"]
        },
        cooling: {
            foodPairingHints: ["Fruit Salads", "Chocolate", "Lamb Dishes", "Yogurt"],
            seasonalAffinityHints: ["Summer", "Spring"],
            activityHints: ["Refreshment", "Focus", "Digestive"],
            associatedFlavors: ["menthol", "camphor", "mint"]
        }
    },

    sweet: {
        caramel: {
            foodPairingHints: ["Desserts", "Roasted Foods", "Cheese", "Coffee", "Dark Chocolate", "Baked Goods", "Nuts", "Ice Cream"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Comfort", "Warming", "Relaxation", "Evening", "Social"],
            associatedFlavors: ["caramel", "brown sugar", "toffee", "burnt sugar", "molasses"]
        },
        honey: {
            foodPairingHints: ["Light Desserts", "Fruits", "Pastries", "Yogurt"],
            seasonalAffinityHints: ["Any Season"],
            activityHints: ["Comfort", "Relaxation", "Social", "Treat"],
            associatedFlavors: ["sugary", "honey", "malt", "caramel"]
        },
        chocolate: {
            foodPairingHints: ["Desserts", "Berries", "Coffee", "Nuts", "Dark Chocolate", "Baked Goods", "Roasted Nuts"],
            seasonalAffinityHints: ["Winter", "Autumn"],
            activityHints: ["Comfort", "Indulgence", "Relaxation"],
            associatedFlavors: ["cocoa", "dark chocolate", "chocolate"]
        },
        malt: {
            foodPairingHints: ["Breakfast Foods", "Baked Goods", "Biscuits", "Caramel", "Hard Cheese"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Routine"],
            associatedFlavors: ["malt", "cereal", "grain"]
        }
    },

    earthy: {
        soil: {
            foodPairingHints: ["Mushrooms", "Root Vegetables", "Hearty Soups", "Dark Meats", "Grilled Meats"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Grounding", "Contemplative", "Warming"],
            associatedFlavors: ["petrichor", "loam", "forest floor", "wet stone", "soil", "earth"]
        },
        mineral: {
            foodPairingHints: ["Seafood", "Shellfish", "Light Cheese", "Oysters", "Hard Cheese"],
            seasonalAffinityHints: ["Spring", "Summer", "Autumn"],
            activityHints: ["Focus", "Refreshment", "Contemplative"],
            associatedFlavors: ["mineral", "flint", "slate", "chalk"]
        },
        aged: {
            foodPairingHints: ["Rich Foods", "Game Meats", "Dark Chocolate", "Mushrooms", "Root Vegetables", "Spiced Foods"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Contemplative", "Digestive", "Warming"],
            associatedFlavors: ["leather", "autumn leaves", "camphor", "moss", "aged wood", "stored grain"]
        }
    },

    woody: {
        cedar: {
            foodPairingHints: ["Smoked Salmon", "Hard Cheese", "Game Meats", "Grilled Meats"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Focus", "Contemplative"],
            associatedFlavors: ["cedar", "pine"]
        },
        general: {
            foodPairingHints: ["Smoked Foods", "Grilled Meats", "Cheese", "Mushrooms", "Hard Cheese", "Root Vegetables"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Grounding", "Contemplative", "Warming", "Relaxation"],
            associatedFlavors: ["wood", "bark", "oak", "pine", "forest"]
        }
    },

    roasted: {
        smoky: {
            foodPairingHints: ["Smoked Foods", "BBQ", "Strong Cheese", "Bacon", "Grilled Meats", "Dark Chocolate"],
            seasonalAffinityHints: ["Winter", "Autumn"],
            activityHints: ["Warming", "Contemplative", "Bold Experience"],
            associatedFlavors: ["smoke", "bonfire", "tobacco", "burnt", "pine resin"]
        },
        coffee_like: {
            foodPairingHints: ["Desserts", "Baked Goods", "Cheese", "Roasted Nuts", "Dark Chocolate"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Focus"],
            associatedFlavors: ["coffee", "chicory", "roasted nuts", "espresso"]
        },
        general: {
            foodPairingHints: ["Grilled/Roasted Meats", "Root Vegetables", "Comfort Foods", "Chocolate", "Roasted Nuts", "Spiced Foods"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Evening", "Relaxation"],
            associatedFlavors: ["roasted", "charred", "toasted", "burnt"]
        }
    },

    umami: {
        marine: {
            foodPairingHints: ["Seafood", "Sushi", "Rice Dishes", "Light vegetables"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Focus", "Refreshment", "Cleansing"],
            associatedFlavors: ["seaweed", "nori", "brine", "oceanic", "sea salt"]
        },
        meaty: {
            foodPairingHints: ["Savory Soups", "Stews", "Mushrooms", "Rich Dishes"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Satiating"],
            associatedFlavors: ["savory", "broth", "mushroom", "umami"]
        }
    }
};

export default flavorInfluences;
