import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';

const oolongs = [
  { name: "Tie Guan Yin", caffeine: 2.8, ltheanine: 4.2 },
  { name: "Da Hong Pao", caffeine: 3.5, ltheanine: 4.0 },
  { name: "Wuyi Rock", caffeine: 3.0, ltheanine: 3.8 }
];

async function test() {
  console.log("Testing if compound inference VARIES for different oolong teas:\n");
  
  for (const oolong of oolongs) {
    const result = await new CompoundInferrer().infer({
      caffeineLevel: oolong.caffeine,
      lTheanineLevel: oolong.ltheanine
    });
    
    console.log(`${oolong.name}:`);
    console.log(`  Caffeine: ${oolong.caffeine}, L-Theanine: ${oolong.ltheanine}`);
    console.log(`  Stimulation: ${result.analysis.stimulationLevel}`);
    console.log(`  Relaxation: ${result.analysis.relaxationLevel}`);
    console.log(`  Profile: ${result.analysis.compoundProfile}`);
    console.log("");
  }
}

test().catch(console.error);
