const brewingRecommendations = {
    gongfu: {
        green: {
            leafAmount: '3-3.5g per 100ml',
            waterTemp: '70-85°C',
            steepingTime: [20, 30, 40, 50], // Seconds for consecutive infusions
            vesselRecommendation: {
                preferred: ['Porcelain', 'Glass'],
                notes: 'Porcelain and glass vessels are ideal for preserving the delicate aroma and flavor nuances of green teas. They do not impart any additional flavors and allow for clear evaluation of the tea\'s characteristics.'
            },
            notes: 'Multiple short infusions. Adjust steeping time progressively.'
        },
        white: {
            leafAmount: '3.5-4g per 100ml',
            waterTemp: '75-90°C',
            steepingTime: [30, 40, 50, 60], // Seconds
            vesselRecommendation: {
                preferred: ['Porcelain', 'Glass'],
                notes: 'Use porcelain or glass to maintain the subtle, delicate nature of white teas. These materials do not interfere with the tea\'s light, nuanced flavor profile.'
            },
            notes: 'Delicate leaves. Gentle, progressive steeping.'
        },
        oolong: {
            // Differentiate based on processing style
            strip: {
                leafAmount: '4.5-5g per 100ml',
                waterTemp: '80-90°C',
                steepingTime: [20, 30, 40, 50], // Seconds
                vesselRecommendation: {
                    preferred: ['Porcelain', 'Clay (Unglazed)', 'Yixing'],
                    notes: 'For strip-style oolong, porcelain provides a neutral brewing environment. Clay or Yixing vessels can enhance the tea\'s complexity, especially for more roasted varieties. Clay absorbs tea oils over time, potentially improving subsequent brews.'
                },
                notes: 'Strip-style oolong requires careful steeping.'
            },
            rolled: {
                leafAmount: '5-6g per 100ml',
                waterTemp: '80-90°C',
                steepingTime: [20, 30, 40, 50], // Seconds
                vesselRecommendation: {
                    preferred: ['Porcelain', 'Clay (Unglazed)', 'Yixing'],
                    notes: 'Rolled oolong teas benefit from vessels that retain heat well. Clay or Yixing pots are excellent for their heat retention and ability to develop a tea\'s character over multiple brewing sessions.'
                },
                notes: 'Rolled oolong allows for more leaf volume and multiple infusions.'
            },
            // roasted: {
            //     leafAmount: '4.5-5g per 100ml',
            //     waterTemp: '90-95°C',
            //     steepingTime: [15, 25, 35, 45], // Seconds
            //     vesselRecommendation: {
            //         preferred: ['Clay (Unglazed)', 'Yixing'],
            //         notes: 'Roasted oolongs are best brewed in clay or Yixing vessels. The porous nature of these materials can absorb and enhance the roasted, complex flavors over time.'
            //     },
            //     notes: 'Roasted oolongs can handle slightly higher temperatures.'
            // }
        },
        black: {
            leafAmount: '4-4.5g per 100ml',
            waterTemp: '90-95°C',
            steepingTime: [15, 25, 35, 45], // Seconds
            vesselRecommendation: {
                preferred: ['Clay (Unglazed)', 'Yixing', 'Porcelain'],
                notes: 'Black teas pair wonderfully with clay or Yixing vessels. These materials can develop a rich patina over time, subtly enhancing the robust flavors of black tea.'
            },
            notes: 'Strong tea. Progressive steeping helps manage intensity.'
        },
        puerh: {
            // Differentiate between raw (sheng) and ripe (shou)
            sheng: {
                leafAmount: '5g per 100ml',
                waterTemp: '85-95°C', // Lower for young raw puerh
                steepingTime: [20, 30, 40, 50], // Seconds
                vesselRecommendation: {
                    preferred: ['Clay (Unglazed)', 'Yixing'],
                    notes: 'Clay or Yixing vessels are essential for puerh, especially raw puerh. The porous clay helps to mellow the tea\'s character and can contribute to aging and flavor development.'
                },
                rinseTimes: 1,
                notes: 'Young raw puerh requires gentler approach. One rinse recommended.'
            },
            shou: {
                leafAmount: '5g per 100ml',
                waterTemp: '95-100°C',
                steepingTime: [15, 25, 35, 45], // Seconds
                vesselRecommendation: {
                    preferred: ['Clay (Unglazed)', 'Yixing'],
                    notes: 'Ripe puerh thrives in clay or Yixing vessels. These materials help to smooth out the tea\'s robust character and develop depth over multiple brewing sessions.'
                },
                rinseTimes: 2,
                notes: 'Ripe puerh can handle higher temperatures. Two quick rinses recommended.'
            }
        }
    },
    western: {
        green: {
            leafAmount: '1-1.5 tsp per 177ml (6oz) or 3-5g per 500ml',
            waterTemp: '70-80°C',
            steepingTime: 2, // Minutes
            vesselRecommendation: {
                preferred: ['Glass', 'Ceramic', 'Porcelain'],
                notes: 'Use vessels that do not retain heat excessively. Glass or ceramic allow for precise temperature control and do not impart additional flavors to the delicate green tea.'
            },
            notes: 'Avoid over-steeping to prevent bitterness.'
        },
        white: {
            leafAmount: '1-1.5 tsp per 177ml (6oz) or 3-5g per 500ml',
            waterTemp: '65-75°C',
            steepingTime: 4, // Minutes
            vesselRecommendation: {
                preferred: ['Glass', 'Porcelain', 'Ceramic'],
                notes: 'Choose light-colored, neutral vessels that won\'t overwhelm the subtle flavors of white tea. Glass or porcelain are ideal for maintaining the tea\'s delicate nature.'
            },
            notes: 'Delicate leaves. Gentle steeping recommended.'
        },
        oolong: {
            // Differentiate processing styles
            strip: {
                leafAmount: '1-1.5 tsp per 177ml (6oz) or 3-5g per 500ml',
                waterTemp: '80-90°C',
                steepingTime: 3, // Minutes
                vesselRecommendation: {
                    preferred: ['Glass', 'Porcelain', 'Ceramic'],
                    notes: 'Light oolongs benefit from neutral vessels that preserve their delicate flavor profile. Glass or porcelain allow the nuanced flavors to shine through.'
                },
                notes: 'Lighter oolongs require careful steeping.'
            },
            rolled: {
                leafAmount: '1-1.5 tsp per 177ml (6oz) or 3-5g per 500ml',
                waterTemp: '85-90°C',
                steepingTime: 3, // Minutes
                vesselRecommendation: {
                    preferred: ['Ceramic', 'Porcelain'],
                    notes: 'Rolled oolongs benefit from vessels that provide good heat retention while maintaining the tea\'s complex flavor profile. Ceramic or porcelain are ideal for drawing out the tea\'s layered characteristics.'
                },
                notes: 'Rolled oolongs require careful attention to brewing parameters.'
            },
            // roasted: {
            //     leafAmount: '1-1.5 tsp per 177ml (6oz) or 3-5g per 500ml',
            //     waterTemp: '90-95°C',
            //     steepingTime: 4, // Minutes
            //     vesselRecommendation: {
            //         preferred: ['Ceramic', 'Stoneware'],
            //         notes: 'Roasted oolongs pair well with slightly more substantial vessels like ceramic or stoneware, which can handle higher temperatures and complement the tea\'s robust character.'
            //     },
            //     notes: 'Roasted oolongs can handle slightly longer steeping.'
            // }
        },
        black: {
            leafAmount: '1-1.5 tsp per 177ml (6oz) or 3-5g per 500ml',
            waterTemp: '90-100°C',
            steepingTime: 3, // Minutes
            vesselRecommendation: {
                preferred: ['Ceramic', 'Stoneware', 'Cast Iron'],
                notes: 'Black teas benefit from vessels that retain heat well. Ceramic, stoneware, or cast iron can help maintain temperature and enhance the tea\'s robust flavors.'
            },
            notes: 'Classic full-bodied brew.'
        },
        puerh: {
            // Differentiate between raw (sheng) and ripe (shou)
            sheng: {
                leafAmount: '1-1.5 tsp per 177ml (6oz) or 3-5g per 500ml',
                waterTemp: '85-95°C',
                steepingTime: 3, // Minutes
                vesselRecommendation: {
                    preferred: ['Clay', 'Ceramic', 'Stoneware'],
                    notes: 'Young raw puerh benefits from vessels that can help mellow its character. Clay or ceramic vessels are ideal for managing the tea\'s complex flavor profile.'
                },
                notes: 'Young raw puerh requires gentler approach.'
            },
            shou: {
                leafAmount: '1-1.5 tsp per 177ml (6oz) or 3-5g per 500ml',
                waterTemp: '95-100°C',
                steepingTime: 4, // Minutes
                vesselRecommendation: {
                    preferred: ['Clay', 'Ceramic', 'Cast Iron'],
                    notes: 'Ripe puerh pairs well with heat-retentive vessels like clay or cast iron. These materials can help smooth out the tea\'s robust character and develop depth.'
                },
                notes: 'Ripe puerh can handle robust brewing.'
            }
        }
    }
};
export default brewingRecommendations;