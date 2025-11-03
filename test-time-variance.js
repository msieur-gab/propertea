import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';

const oolongs = [
  { name: "Tie Guan Yin", caffeine: 4, ltheanine: 5.5 },
  { name: "Da Hong Pao", caffeine: 4.5, ltheanine: 4.5 },
  { name: "Fenghuang Dancong", caffeine: 4.8, ltheanine: 4.8 },
  { name: "Dong Ding", caffeine: 4.2, ltheanine: 5.2 },
  { name: "Ali Shan", caffeine: 3.5, ltheanine: 6.5 }
];

async function test() {
  console.log("=== ANALYZING WHAT TIMERENDERER RECEIVES ===\n");
  
  for (const oolong of oolongs) {
    const compound = await new CompoundInferrer().infer({
      caffeineLevel: oolong.caffeine,
      lTheanineLevel: oolong.ltheanine
    });
    
    const teaType = await new TeaTypeInferrer().infer({
      type: 'oolong'
    });
    
    console.log(`${oolong.name}:`);
    console.log(`  Caffeine: ${oolong.caffeine}, L-Theanine: ${oolong.ltheanine}`);
    console.log(`  Stimulation: "${compound.analysis.stimulationLevel}"`);
    console.log(`  Relaxation: "${compound.analysis.relaxationLevel}"`);
    console.log(`  Profile: "${compound.analysis.compoundProfile}"`);
    console.log(`  Tea Type: "${teaType.analysis.displayName}"`);
    console.log();
  }
}

test().catch(console.error);
