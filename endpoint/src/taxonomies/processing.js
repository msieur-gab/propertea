/**
 * processing.js
 *
 * Unified taxonomy for tea processing methods and their characteristics
 * Single source of truth for processing definitions and their effects
 *
 * ID Convention: UPPERCASE_WITH_UNDERSCORES
 * Example: PROCESSING_STEAMED, CATEGORY_HEAT_OXIDATION_STOP
 *
 * ALIGNMENT NOTE: Aliases include exact kebab-case names from admin form (teaData.js)
 * so that both conventions (IDs and form names) are supported
 */

export class ProcessingTaxonomy {
  /**
   * Processing Categories
   * Groups processing methods by their primary effect or stage
   */
  static CATEGORIES = {
    CATEGORY_HEAT_OXIDATION_STOP: {
      id: 'CATEGORY_HEAT_OXIDATION_STOP',
      displayName: 'Heat & Oxidation Stop',
      description: 'Methods that use heat to halt enzymatic oxidation'
    },
    CATEGORY_SHAPING_BRUISING: {
      id: 'CATEGORY_SHAPING_BRUISING',
      displayName: 'Shaping & Bruising',
      description: 'Methods that shape leaves and control cell wall rupture'
    },
    CATEGORY_ROASTING: {
      id: 'CATEGORY_ROASTING',
      displayName: 'Roasting',
      description: 'Methods using heat to develop roasted flavors'
    },
    CATEGORY_OXIDATION: {
      id: 'CATEGORY_OXIDATION',
      displayName: 'Oxidation',
      description: 'Methods controlling enzymatic browning and oxidation level'
    },
    CATEGORY_GROWING: {
      id: 'CATEGORY_GROWING',
      displayName: 'Growing & Special',
      description: 'Growing conditions and special processing methods'
    },
    CATEGORY_AGING_FERMENTATION: {
      id: 'CATEGORY_AGING_FERMENTATION',
      displayName: 'Aging & Fermentation',
      description: 'Post-processing methods involving time and microbial activity'
    },
    CATEGORY_SCENTING: {
      id: 'CATEGORY_SCENTING',
      displayName: 'Scenting',
      description: 'Methods adding floral or aromatic scents'
    }
  };

  /**
   * Processing Methods
   * Each method has multiple properties describing its effects
   * Aliases include admin form kebab-case names for compatibility
   */
  static METHODS = {
    // ========== HEAT & OXIDATION STOP ==========
    PROCESSING_STEAMED: {
      id: 'PROCESSING_STEAMED',
      displayName: 'Steamed',
      category: 'CATEGORY_HEAT_OXIDATION_STOP',
      aliases: ['steamed', 'steaming', 'steam-fixed'],
      description: 'Gentle heat preservation (common in Japanese greens) that maintains delicate compounds and vibrant color',
      flavorImpact: ['enhances vegetal/marine notes', 'preserves freshness', 'reduces bitterness'],
      mouthFeel: 'lighter',
      energeticTendency: 'cooling',
      compoundEffect: 'clean focus',
      compoundNotes: ['preserves catechins well', 'maintains L-theanine'],
      // Seasonal affinity: Cooling methods best for warm seasons
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 15 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 20 },
        { seasonId: 'SEASON_SUMMER', boost: 25 },
        { seasonId: 'SEASON_LATE_SUMMER', boost: 20 }
      ]
    },
    PROCESSING_PAN_FIRED: {
      id: 'PROCESSING_PAN_FIRED',
      displayName: 'Pan-Fired',
      category: 'CATEGORY_HEAT_OXIDATION_STOP',
      aliases: ['pan-fired', 'pan firing', 'pan-roasted'],
      description: 'Toasting method (common in Chinese greens) to halt oxidation, adding subtle complexity and nutty notes',
      flavorImpact: ['adds subtle nutty/toasty notes', 'reduces vegetal intensity', 'creates mellow sweetness'],
      mouthFeel: 'medium-light',
      energeticTendency: 'neutral-warming',
      compoundEffect: 'focused',
      compoundNotes: ['slightly modifies catechins', 'preserves most compounds'],
      // Seasonal affinity: Neutral-warming, transitional seasons
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_SPRING', boost: 10 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 12 },
        { seasonId: 'SEASON_AUTUMN', boost: 10 }
      ]
    },
    PROCESSING_KILL_GREEN: {
      id: 'PROCESSING_KILL_GREEN',
      displayName: 'Kill-Green',
      category: 'CATEGORY_HEAT_OXIDATION_STOP',
      aliases: ['kill-green', 'kill green', 'fixation'],
      description: 'General term for halting enzymatic oxidation using heat',
      flavorImpact: ['stops development of oxidized notes', 'preserves existing fresh notes'],
      mouthFeel: 'variable',
      energeticTendency: 'neutral',
      compoundEffect: 'neutral',
      compoundNotes: ['stops enzymatic changes'],
      // Seasonal affinity: Neutral, year-round, no strong preference
      seasonalAffinity: [
        { seasonId: 'SEASON_ANYTIME', boost: 5 }
      ]
    },

    // ========== SHAPING & BRUISING ==========
    PROCESSING_ROLLED: {
      id: 'PROCESSING_ROLLED',
      displayName: 'Rolled',
      category: 'CATEGORY_SHAPING_BRUISING',
      aliases: ['rolled', 'rolling', 'hand-rolled', 'machine-rolled'],
      description: 'Process of curling, twisting or rolling tea leaves to shape them and break cell walls',
      flavorImpact: ['concentrates flavor compounds', 'increases extraction rate', 'enhances complexity'],
      mouthFeel: 'fuller extraction',
      energeticTendency: 'neutral',
      compoundEffect: 'enhanced strength',
      compoundNotes: ['increased compound extraction', 'accelerates oxidation'],
      // Seasonal affinity: Neutral shaping, year-round
      seasonalAffinity: [
        { seasonId: 'SEASON_ANYTIME', boost: 5 }
      ]
    },
    PROCESSING_BALL_ROLLED: {
      id: 'PROCESSING_BALL_ROLLED',
      displayName: 'Ball-Rolled',
      category: 'CATEGORY_SHAPING_BRUISING',
      aliases: ['ball-rolled', 'ball rolled', 'bullet rolled'],
      description: 'Tight rolling into small balls (e.g., Taiwanese high mountain oolongs), gradual unfurling during brewing',
      flavorImpact: ['creates multi-infusion complexity', 'protects aromatic compounds', 'concentrated flavor release'],
      mouthFeel: 'silky, evolving with each infusion',
      energeticTendency: 'neutral-warming',
      compoundEffect: 'gradual release',
      compoundNotes: ['extended release of compounds', 'preserves volatile aromatics'],
      // Seasonal affinity: Neutral-warming, mild autumn preference
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 10 },
        { seasonId: 'SEASON_AUTUMN', boost: 12 }
      ]
    },
    PROCESSING_STRIP_ROLLED: {
      id: 'PROCESSING_STRIP_ROLLED',
      displayName: 'Strip-Rolled',
      category: 'CATEGORY_SHAPING_BRUISING',
      aliases: ['strip-rolled', 'strip rolled', 'twisted'],
      description: 'Rolling leaves into long, twisted strips (common in many oolongs), balancing oxidation and flavor release',
      flavorImpact: ['balanced flavor profile', 'moderate extraction rate', 'preserves complexity'],
      mouthFeel: 'medium',
      energeticTendency: 'neutral',
      compoundEffect: 'balanced',
      compoundNotes: ['balanced oxidation', 'moderate cell rupture'],
      // Seasonal affinity: Neutral, year-round
      seasonalAffinity: [
        { seasonId: 'SEASON_ANYTIME', boost: 5 }
      ]
    },
    PROCESSING_TUMBLED: {
      id: 'PROCESSING_TUMBLED',
      displayName: 'Tumbled',
      category: 'CATEGORY_SHAPING_BRUISING',
      aliases: ['tumbled', 'tumbling', 'tumble dried'],
      description: 'Method of tumbling leaves in drums or machines to shape and bruise without traditional rolling',
      flavorImpact: ['creates uniform shape', 'moderate cell wall rupture', 'consistent extraction'],
      mouthFeel: 'medium',
      energeticTendency: 'neutral',
      compoundEffect: 'balanced',
      compoundNotes: ['controlled bruising', 'moderate extraction'],
      // Seasonal affinity: Neutral, year-round
      seasonalAffinity: [
        { seasonId: 'SEASON_ANYTIME', boost: 5 }
      ]
    },

    // ========== ROASTING ==========
    PROCESSING_MINIMAL_ROAST: {
      id: 'PROCESSING_MINIMAL_ROAST',
      displayName: 'Minimal-Roast',
      category: 'CATEGORY_ROASTING',
      aliases: ['minimal-roast', 'minimal roast', 'ultra-light roast'],
      description: 'Very light roasting (often for light oolongs or finishing) preserving brightness',
      flavorImpact: ['enhances aroma', 'adds subtle warmth', 'preserves most original flavors'],
      mouthFeel: 'unchanged',
      energeticTendency: 'neutral-warming',
      compoundEffect: 'smooths slightly',
      compoundNotes: [],
      // Seasonal affinity: Light roast, transitional seasons preference
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_SPRING', boost: 12 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 10 }
      ]
    },
    PROCESSING_LIGHT_ROAST: {
      id: 'PROCESSING_LIGHT_ROAST',
      displayName: 'Light-Roast',
      category: 'CATEGORY_ROASTING',
      aliases: ['light-roast', 'light roast'],
      description: 'Subtle roasting adding complexity without deep toasted notes',
      flavorImpact: ['adds light nutty/grainy notes', 'enhances sweetness', 'rounds off sharp edges'],
      mouthFeel: 'slightly fuller',
      energeticTendency: 'warming',
      compoundEffect: 'smooths',
      compoundNotes: ['starts Maillard reactions'],
      // Seasonal affinity: Light warming, spring & early autumn
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 15 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 15 }
      ]
    },
    PROCESSING_MEDIUM_ROAST: {
      id: 'PROCESSING_MEDIUM_ROAST',
      displayName: 'Medium-Roast',
      category: 'CATEGORY_ROASTING',
      aliases: ['medium-roast', 'medium roast'],
      description: 'Balanced roasting developing richer, complex notes like nuts, caramel, or toast',
      flavorImpact: ['develops nutty/caramel/toasty notes', 'reduces floral/vegetal notes', 'increases sweetness'],
      mouthFeel: 'fuller',
      energeticTendency: 'warming',
      compoundEffect: 'smooths significantly',
      compoundNotes: ['promotes Maillard reactions', 'may slightly degrade volatile compounds'],
      // Seasonal affinity: Warming, autumn & winter preference
      seasonalAffinity: [
        { seasonId: 'SEASON_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 15 }
      ]
    },
    PROCESSING_HEAVY_ROAST: {
      id: 'PROCESSING_HEAVY_ROAST',
      displayName: 'Heavy-Roast',
      category: 'CATEGORY_ROASTING',
      aliases: ['heavy-roast', 'heavy roast', 'dark roast'],
      description: 'Intense roasting creating deep, dark flavors like dark caramel, chocolate, or burnt sugar',
      flavorImpact: ['adds dark caramel/chocolate/burnt sugar notes', 'significantly reduces original fresh/floral notes', 'mellows tannins'],
      mouthFeel: 'much fuller',
      energeticTendency: 'very warming',
      compoundEffect: 'very smooth, blunts peak',
      compoundNotes: ['significant Maillard/caramelization', 'may degrade catechins/vitamins'],
      // Seasonal affinity: Strongly warming, winter preference (PRIMARY driver)
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 20 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 25 },
        { seasonId: 'SEASON_WINTER', boost: 30 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 20 }
      ]
    },
    PROCESSING_CHARCOAL_ROASTED: {
      id: 'PROCESSING_CHARCOAL_ROASTED',
      displayName: 'Charcoal-Roasted',
      category: 'CATEGORY_ROASTING',
      aliases: ['charcoal-roasted', 'charcoal roasted', 'charcoal-roast', 'charcoal-fired'],
      description: 'Traditional roasting over charcoal, often imparting a unique mineral note and deep complexity',
      flavorImpact: ['adds deep nutty/caramel notes', 'adds subtle mineral/smoky hint', 'creates complexity'],
      mouthFeel: 'fuller',
      energeticTendency: 'very warming',
      compoundEffect: 'very smooth, complex energy',
      compoundNotes: ['similar to heavy roast', 'may add trace elements'],
      // Seasonal affinity: Very warming, deep winter preference
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 22 },
        { seasonId: 'SEASON_WINTER', boost: 28 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 18 }
      ]
    },
    PROCESSING_ROCK_FIRED: {
      id: 'PROCESSING_ROCK_FIRED',
      displayName: 'Rock-Fired',
      category: 'CATEGORY_ROASTING',
      aliases: ['rock-fired', 'rock fired', 'rock roast'],
      description: 'Traditional Taiwanese method of roasting over hot rocks, creating distinctive mineral and sweet notes',
      flavorImpact: ['adds mineral/rocky notes', 'enhances sweetness', 'creates unique terroir expression'],
      mouthFeel: 'fuller',
      energeticTendency: 'warming',
      compoundEffect: 'smooth with character',
      compoundNotes: ['mineral infusion', 'Maillard reactions'],
      // Seasonal affinity: Warming mineral notes, autumn & winter
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 16 },
        { seasonId: 'SEASON_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 16 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 14 }
      ]
    },

    // ========== OXIDATION & WITHERING ==========
    PROCESSING_WITHERED: {
      id: 'PROCESSING_WITHERED',
      displayName: 'Withered',
      category: 'CATEGORY_OXIDATION',
      aliases: ['withered', 'withering'],
      description: 'Initial moisture reduction, allowing enzymes to begin working, developing precursors for aroma and flavor',
      flavorImpact: ['develops floral precursors', 'reduces grassy notes slightly'],
      mouthFeel: 'unchanged',
      energeticTendency: 'neutral',
      compoundEffect: 'neutral',
      compoundNotes: ['starts enzymatic activity', 'reduces water content'],
      // Seasonal affinity: Neutral preparation, year-round
      seasonalAffinity: [
        { seasonId: 'SEASON_ANYTIME', boost: 5 }
      ]
    },
    PROCESSING_SUN_DRIED: {
      id: 'PROCESSING_SUN_DRIED',
      displayName: 'Sun-Dried',
      category: 'CATEGORY_OXIDATION',
      aliases: ['sun-dried', 'sun dried', 'sun drying'],
      description: 'Drying using sunlight, often gentler than machine drying, can add subtle fruity/honey notes',
      flavorImpact: ['adds subtle honey/fruity notes', 'preserves delicate aromas'],
      mouthFeel: 'lighter',
      energeticTendency: 'neutral-warming',
      compoundEffect: 'neutral',
      compoundNotes: ['UV exposure can alter some compounds'],
      // Seasonal affinity: Neutral-warming, spring/summer preference
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 12 },
        { seasonId: 'SEASON_SUMMER', boost: 10 }
      ]
    },
    PROCESSING_OXIDISED: {
      id: 'PROCESSING_OXIDISED',
      displayName: 'Oxidised',
      category: 'CATEGORY_OXIDATION',
      aliases: ['oxidised', 'oxidized', 'oxidation'],
      description: 'General term indicating enzymatic browning occurred, developing darker colors and different flavor compounds',
      flavorImpact: ['reduces vegetal notes', 'develops fruity/malty/floral notes'],
      mouthFeel: 'fuller',
      energeticTendency: 'warming',
      compoundEffect: 'smooths (compared to green)',
      compoundNotes: ['converts catechins to theaflavins/thearubigins'],
      // Seasonal affinity: Warming oxidation, autumn & winter preference
      seasonalAffinity: [
        { seasonId: 'SEASON_AUTUMN', boost: 16 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 18 },
        { seasonId: 'SEASON_WINTER', boost: 16 }
      ]
    },
    PROCESSING_PARTIAL_OXIDATION: {
      id: 'PROCESSING_PARTIAL_OXIDATION',
      displayName: 'Partial-Oxidation',
      category: 'CATEGORY_OXIDATION',
      aliases: ['partial-oxidation', 'partial oxidation', 'semi-oxidized'],
      description: 'Oxidation halted part-way (10-80%), creating flavors between green and black teas',
      flavorImpact: ['develops diverse floral/fruity/roasted notes', 'reduces vegetal notes'],
      mouthFeel: 'variable (lighter to fuller)',
      energeticTendency: 'neutral-warming',
      compoundEffect: 'balanced/smooth',
      compoundNotes: ['partial catechin conversion'],
      // Seasonal affinity: Balanced, spring & autumn preference
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 14 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 14 },
        { seasonId: 'SEASON_AUTUMN', boost: 12 }
      ]
    },
    PROCESSING_FULL_OXIDATION: {
      id: 'PROCESSING_FULL_OXIDATION',
      displayName: 'Full-Oxidation',
      category: 'CATEGORY_OXIDATION',
      aliases: ['full-oxidation', 'full oxidation', 'fully oxidized'],
      description: 'Complete enzymatic oxidation, developing robust, often malty or fruity flavors and dark color',
      flavorImpact: ['develops malty/fruity/spicy notes', 'eliminates vegetal notes'],
      mouthFeel: 'fuller/robust',
      energeticTendency: 'warming',
      compoundEffect: 'strong but potentially less sharp',
      compoundNotes: ['maximizes theaflavins/thearubigins'],
      // Seasonal affinity: Warming oxidation, autumn & winter preference
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 20 },
        { seasonId: 'SEASON_WINTER', boost: 18 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 14 }
      ]
    },

    // ========== GROWING & SPECIAL ==========
    PROCESSING_SHADE_GROWN: {
      id: 'PROCESSING_SHADE_GROWN',
      displayName: 'Shade-Grown',
      category: 'CATEGORY_GROWING',
      aliases: ['shade-grown', 'shade grown', 'shaded'],
      description: 'Tea plants covered before harvest, reducing photosynthesis and increasing chlorophyll and amino acids (like L-theanine)',
      flavorImpact: ['enhances umami', 'increases sweetness', 'reduces bitterness/astringency', 'adds marine notes'],
      mouthFeel: 'smoother, sometimes thicker',
      energeticTendency: 'neutral-cooling',
      compoundEffect: 'enhanced focus, calming influence',
      compoundNotes: ['increases L-theanine', 'increases chlorophyll', 'reduces catechins slightly'],
      // Seasonal affinity: Cooling, spring & summer preference
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 18 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 20 },
        { seasonId: 'SEASON_SUMMER', boost: 20 }
      ]
    },
    PROCESSING_INSECT_BITTEN: {
      id: 'PROCESSING_INSECT_BITTEN',
      displayName: 'Insect-Bitten',
      category: 'CATEGORY_GROWING',
      aliases: ['insect-bitten', 'insect bitten', 'bug bitten', 'chewed leaves'],
      description: 'Tea leaves naturally bitten or chewed by insects, triggering defense mechanisms that enhance flavor and aroma',
      flavorImpact: ['enhances floral aromatics', 'adds fruity notes', 'increases sweetness', 'creates unique complexity'],
      mouthFeel: 'smoother',
      energeticTendency: 'neutral',
      compoundEffect: 'enhanced aroma',
      compoundNotes: ['increases volatile compounds', 'enhances natural aromatics'],
      // Seasonal affinity: Neutral, spring preference (harvest season dependent)
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 16 },
        { seasonId: 'SEASON_SUMMER', boost: 12 }
      ]
    },
    PROCESSING_MINIMAL_PROCESSING: {
      id: 'PROCESSING_MINIMAL_PROCESSING',
      displayName: 'Minimal-Processing',
      category: 'CATEGORY_GROWING',
      aliases: ['minimal-processing', 'minimal processing', 'white tea style'],
      description: 'Processing limited mainly to withering and drying, preserving natural state',
      flavorImpact: ['preserves delicate/subtle notes', 'often adds hay/dried fruit notes'],
      mouthFeel: 'lighter, delicate',
      energeticTendency: 'cooling',
      compoundEffect: 'gentle',
      compoundNotes: ['preserves high levels of antioxidants', 'minimal enzymatic change'],
      // Seasonal affinity: Cooling white tea, spring & summer
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 18 },
        { seasonId: 'SEASON_SUMMER', boost: 15 }
      ]
    },
    PROCESSING_GABA_PROCESSED: {
      id: 'PROCESSING_GABA_PROCESSED',
      displayName: 'GABA-Processed',
      category: 'CATEGORY_GROWING',
      aliases: ['gaba-processed', 'gaba processed', 'gaba tea'],
      description: 'Processed in a nitrogen-rich, oxygen-deprived environment to increase Gamma-aminobutyric acid (GABA)',
      flavorImpact: ['adds unique tangy/fruity notes', 'can have slight savory quality'],
      mouthFeel: 'smooth',
      energeticTendency: 'neutral',
      compoundEffect: 'calming influence, reduces sharp peak',
      compoundNotes: ['significantly increases GABA', 'increases alanine'],
      // Seasonal affinity: Neutral-calming, year-round with spring preference
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 12 },
        { seasonId: 'SEASON_ANYTIME', boost: 5 }
      ]
    },

    // ========== AGING & FERMENTATION ==========
    PROCESSING_AGED: {
      id: 'PROCESSING_AGED',
      displayName: 'Aged',
      category: 'CATEGORY_AGING_FERMENTATION',
      aliases: ['aged', 'aging', 'aged tea'],
      description: 'Stored over time (months to years), allowing slow chemical changes that mellow harsh notes and develop complexity',
      flavorImpact: ['mellows astringency/bitterness', 'develops complexity', 'adds earthy/woody/fruity notes'],
      mouthFeel: 'smoother, often thicker',
      energeticTendency: 'neutral-warming',
      compoundEffect: 'smooth, sustained',
      compoundNotes: ['slow oxidation/fermentation continues', 'volatile compounds change'],
      // Seasonal affinity: Neutral-warming aged, autumn & winter preference
      seasonalAffinity: [
        { seasonId: 'SEASON_AUTUMN', boost: 14 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 16 },
        { seasonId: 'SEASON_WINTER', boost: 16 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 12 }
      ]
    },
    PROCESSING_COMPRESSED: {
      id: 'PROCESSING_COMPRESSED',
      displayName: 'Compressed',
      category: 'CATEGORY_AGING_FERMENTATION',
      aliases: ['compressed', 'compression', 'pressed'],
      description: 'Tea leaves steamed and pressed into shapes (cakes, bricks) for aging and storage',
      flavorImpact: ['facilitates slower, different aging profile vs loose leaf'],
      mouthFeel: 'may increase perceived thickness over time',
      energeticTendency: 'neutral',
      compoundEffect: 'neutral',
      compoundNotes: ['affects microbial activity during aging'],
      // Seasonal affinity: Neutral, year-round
      seasonalAffinity: [
        { seasonId: 'SEASON_ANYTIME', boost: 5 }
      ]
    },
    PROCESSING_FERMENTED: {
      id: 'PROCESSING_FERMENTED',
      displayName: 'Fermented',
      category: 'CATEGORY_AGING_FERMENTATION',
      aliases: ['fermented', 'fermentation', 'microbial'],
      description: 'Involves microbial activity (natural or accelerated) after halting initial oxidation. Creates earthy, smooth, dark teas',
      flavorImpact: ['adds strong earthy/woody/mossy notes', 'eliminates bitterness/astringency', 'adds unique sweetness'],
      mouthFeel: 'smooth, thick',
      energeticTendency: 'warming',
      compoundEffect: 'smooth, grounding energy',
      compoundNotes: ['microbial transformation of compounds', 'produces statins (in some)', 'reduces caffeine bioavailability?'],
      // Seasonal affinity: Warming fermentation, autumn & winter preference (especially puerh)
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 22 },
        { seasonId: 'SEASON_WINTER', boost: 24 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 16 }
      ]
    },
    PROCESSING_PILE_FERMENTED: {
      id: 'PROCESSING_PILE_FERMENTED',
      displayName: 'Pile-Fermented',
      category: 'CATEGORY_AGING_FERMENTATION',
      aliases: ['pile-fermented', 'pile fermented', 'shou puerh'],
      description: 'Accelerated fermentation method used for shou/ripe puerh, where leaves are piled in controlled conditions',
      flavorImpact: ['develops earthy/woody notes', 'reduces bitterness', 'can have compost-like qualities when young'],
      mouthFeel: 'smooth, thick',
      energeticTendency: 'warming',
      compoundEffect: 'gentle, grounding',
      compoundNotes: ['rapid microbial transformation', 'changes compound profile'],
      // Seasonal affinity: Warming shou puerh, winter preference (PRIMARY winter tea)
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 20 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 25 },
        { seasonId: 'SEASON_WINTER', boost: 28 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 18 }
      ]
    },
    PROCESSING_ANAEROBIC_FERMENTED: {
      id: 'PROCESSING_ANAEROBIC_FERMENTED',
      displayName: 'Anaerobic-Fermented',
      category: 'CATEGORY_AGING_FERMENTATION',
      aliases: ['anaerobic-fermentation', 'anaerobic fermentation', 'oxygen-deprived'],
      description: 'Fermentation in oxygen-deprived environment, developing unique fruity and sweet characteristics',
      flavorImpact: ['develops unique fruity/floral notes', 'enhances sweetness', 'creates distinctive complexity'],
      mouthFeel: 'smooth',
      energeticTendency: 'neutral-warming',
      compoundEffect: 'balanced',
      compoundNotes: ['anaerobic microbial activity', 'produces unique esters'],
      // Seasonal affinity: Neutral-warming fermented, year-round with slight autumn preference
      seasonalAffinity: [
        { seasonId: 'SEASON_AUTUMN', boost: 12 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 14 }
      ]
    },

    // ========== SCENTING ==========
    PROCESSING_JASMINE_SCENTED: {
      id: 'PROCESSING_JASMINE_SCENTED',
      displayName: 'Jasmine-Scented',
      category: 'CATEGORY_SCENTING',
      aliases: ['jasmine-scented', 'jasmine scented', 'jasmine tea'],
      description: 'Tea leaves (usually green or white) are layered with fresh jasmine blossoms to absorb the aroma',
      flavorImpact: ['adds strong floral jasmine aroma/flavor'],
      mouthFeel: 'unchanged (depends on base tea)',
      energeticTendency: 'cooling',
      compoundEffect: 'calming influence',
      compoundNotes: ['adds volatile aroma compounds from jasmine'],
      // Seasonal affinity: Cooling floral, spring & summer
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 18 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 16 },
        { seasonId: 'SEASON_SUMMER', boost: 14 }
      ]
    },
    PROCESSING_ROSE_SCENTED: {
      id: 'PROCESSING_ROSE_SCENTED',
      displayName: 'Rose-Scented',
      category: 'CATEGORY_SCENTING',
      aliases: ['rose-scented', 'rose scented', 'rose tea'],
      description: 'Tea infused with rose aroma, typically using fresh rose petals layered with tea leaves',
      flavorImpact: ['adds sweet floral rose notes', 'enhances perceived sweetness'],
      mouthFeel: 'unchanged (depends on base tea)',
      energeticTendency: 'cooling',
      compoundEffect: 'uplifting, calming',
      compoundNotes: ['adds rose volatile compounds', 'may contain trace essential oils'],
      // Seasonal affinity: Cooling floral, spring & early summer
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 16 }
      ]
    },
    PROCESSING_OSMANTHUS_SCENTED: {
      id: 'PROCESSING_OSMANTHUS_SCENTED',
      displayName: 'Osmanthus-Scented',
      category: 'CATEGORY_SCENTING',
      aliases: ['osmanthus-scented', 'osmanthus scented', 'osmanthus tea'],
      description: 'Tea infused with sweet, fruity osmanthus flowers, common in oolong and green teas',
      flavorImpact: ['adds apricot-like floral sweetness', 'fruity undertones'],
      mouthFeel: 'unchanged (depends on base tea)',
      energeticTendency: 'neutral-cooling',
      compoundEffect: 'uplifting',
      compoundNotes: ['adds fruity-floral volatiles'],
      // Seasonal affinity: Neutral-cooling floral, spring through early autumn
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 16 },
        { seasonId: 'SEASON_SUMMER', boost: 12 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 14 }
      ]
    },

    // ========== MODERN/INDUSTRIAL ==========
    PROCESSING_CTC: {
      id: 'PROCESSING_CTC',
      displayName: 'CTC',
      category: 'CATEGORY_SHAPING_BRUISING',
      aliases: ['ctc', 'CTC', 'crush-tear-curl'],
      description: 'Industrial method (Crush-Tear-Curl) involving machines that crush, tear, and curl leaves for fast, strong infusion',
      flavorImpact: ['creates strong, bold, often one-dimensional flavor', 'high astringency'],
      mouthFeel: 'strong, robust, astringent',
      energeticTendency: 'warming',
      compoundEffect: 'sharp peak, fast acting',
      compoundNotes: ['maximizes surface area for quick extraction', 'can damage leaf structure'],
      // Seasonal affinity: Warming, autumn & winter (CTC black teas often drunk hot)
      seasonalAffinity: [
        { seasonId: 'SEASON_AUTUMN', boost: 14 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 16 },
        { seasonId: 'SEASON_WINTER', boost: 14 }
      ]
    }
  };

  /**
   * Get processing method by ID or alias (case-insensitive)
   * @param {string} query - Processing method ID or alias
   * @returns {Object|null} - Processing method object or null if not found
   */
  static getMethod(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, method] of Object.entries(this.METHODS)) {
      if (id.toLowerCase() === normalizedQuery) {
        return method;
      }
    }

    // Try alias match
    for (const method of Object.values(this.METHODS)) {
      if (method.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return method;
      }
    }

    return null;
  }

  /**
   * Get category by ID or displayName
   * @param {string} query - Category ID or displayName
   * @returns {Object|null} - Category object or null if not found
   */
  static getCategory(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    for (const category of Object.values(this.CATEGORIES)) {
      if (
        category.id.toLowerCase() === normalizedQuery ||
        category.displayName.toLowerCase() === normalizedQuery
      ) {
        return category;
      }
    }

    return null;
  }

  /**
   * Get all methods in a category
   * @param {string} categoryId - Category ID or displayName
   * @returns {Array} - Array of method objects
   */
  static getMethodsByCategory(categoryId) {
    const category = this.getCategory(categoryId);
    if (!category) return [];

    return Object.values(this.METHODS).filter(
      method => method.category === category.id
    );
  }

  /**
   * Get all categories
   * @returns {Array} - Array of all category objects
   */
  static getAllCategories() {
    return Object.values(this.CATEGORIES);
  }

  /**
   * Get all methods
   * @returns {Array} - Array of all method objects
   */
  static getAllMethods() {
    return Object.values(this.METHODS);
  }

  /**
   * List all valid method IDs and aliases (for error messages)
   * @returns {Array} - Array of all valid identifiers
   */
  static listAllValid() {
    const valid = [];

    Object.values(this.METHODS).forEach(method => {
      valid.push(method.id);
      valid.push(...method.aliases);
    });

    return valid;
  }

  /**
   * Validate that a processing method exists
   * Throws helpful error if not found
   * @param {string} query - Method ID or alias
   * @throws {Error} - If method not found
   */
  static validateMethod(query) {
    const method = this.getMethod(query);

    if (!method) {
      throw new Error(
        `Unknown processing method: "${query}"\n` +
        `Valid methods: ${this.listAllValid().join(', ')}`
      );
    }

    return method;
  }
}

export default ProcessingTaxonomy;
