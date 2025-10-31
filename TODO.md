# Propertea Backend Development - TODO List

**Last Updated:** 2025-11-01
**Current Phase:** Ready to Start Phase 1 (REST API Endpoints)
**Repository:** refactor/api-consolidation branch

---

## 📊 Overview

- ✅ **Completed:** Descriptor consolidation, backend cleanup, validation test framework
- 🚀 **In Queue:** 12 tasks across 5 development phases
- **Total Estimated Time:** 9-15 hours

---

## 🥇 PHASE 1: REST API ENDPOINTS (HIGH PRIORITY - QUICK WIN)

**Status:** Ready to Start
**Estimated Time:** 1-2 hours
**Objective:** Make API accessible via HTTP endpoints

### Tasks

- [ ] **1.1** Implement `POST /api/tea/analyze` endpoint
  - Input validation for tea data (name, type, flavorProfile, etc.)
  - Wire TeaCalculationOrchestrator
  - Return complete analysis with narratives
  - Error handling for invalid requests

- [ ] **1.2** Implement `GET /api/health` health check endpoint
  - Simple status response
  - Database/service connectivity check

- [ ] **1.3** Add input validation and error handling
  - Request body validation
  - Meaningful error messages
  - HTTP status codes (400, 422, 500, etc.)

- [ ] **1.4** Test API with curl/Postman
  - Test successful analysis requests
  - Test error cases
  - Validate response structure
  - Test with validation dataset (tea_validation_data.json)

---

## 🥈 PHASE 2: IMPROVE TEXT GENERATION (MEDIUM PRIORITY)

**Status:** Pending Phase 1
**Estimated Time:** 2-3 hours
**Objective:** Create compelling, descriptor-based narratives

### Tasks

- [ ] **2.1** Enhance effect descriptions
  - Pull descriptions from EffectMapping.js
  - Create dynamic effect combination narratives
  - Explain why certain effects are recommended

- [ ] **2.2** Improve activity recommendations text
  - Connect activities to tea characteristics
  - Add contextual explanations
  - Make recommendations more compelling

- [ ] **2.3** Improve food pairing descriptions
  - Explain flavor/texture compatibility
  - Add context about meal occasions
  - Make pairings feel thoughtful

- [ ] **2.4** Add brewing tips and warnings
  - Temperature guidance
  - Reinfusion count hints
  - Storage recommendations

---

## 🥉 PHASE 3: FIX MATCHING ALGORITHMS (MEDIUM PRIORITY)

**Status:** Pending Phase 1
**Estimated Time:** 3-4 hours
**Objective:** Improve recommendation accuracy

### Current Metrics
- Timing: 60% full match accuracy
- Seasonal: 100% accuracy ✅
- Activities: 13.3% accuracy ⚠️ NEEDS WORK
- Foods: 6.7% accuracy ⚠️ NEEDS WORK

### Tasks

- [ ] **3.1** Analyze activity recommendation failures
  - Debug ActivityMatcher algorithm
  - Identify pattern of mismatches
  - Research semantic matching improvements

- [ ] **3.2** Improve activity matching algorithm
  - Better keyword extraction
  - Contextual understanding
  - Test against 15-tea validation set

- [ ] **3.3** Analyze food pairing failures
  - Debug FoodMatcher algorithm
  - Identify flavor/cuisine mismatch patterns
  - Research flavor compatibility science

- [ ] **3.4** Improve food matching algorithm
  - Better flavor-to-cuisine mapping
  - Account for tea body/intensity
  - Test against 15-tea validation set

---

## 🟡 PHASE 4: EXPAND VALIDATION DATASET (LOWER PRIORITY)

**Status:** Pending Phase 1-3
**Estimated Time:** 2-4 hours (ongoing)
**Objective:** Build comprehensive validation dataset

### Tasks

- [ ] **4.1** Expand validation dataset
  - Current: 15 teas
  - Target: 50-100+ varieties
  - Include all tea types (green, white, yellow, oolong, red, black, dark, puerh, herbal, tisane)

- [ ] **4.2** Build automated dataset generator
  - Create template for new tea entries
  - Standardize data format
  - Document validation data structure

- [ ] **4.3** Create validation benchmarks
  - Define success metrics per category
  - Set accuracy targets
  - Create performance dashboard

---

## 🔵 PHASE 5: API DOCUMENTATION (FINAL)

**Status:** Pending Phase 1
**Estimated Time:** 1-2 hours
**Objective:** Professional API documentation

### Tasks

- [ ] **5.1** Create Swagger/OpenAPI specification
  - Define request/response schemas
  - Document all endpoints
  - List all error codes

- [ ] **5.2** Document all endpoints with examples
  - POST /api/tea/analyze
  - GET /api/health
  - Include cURL and HTTP examples

- [ ] **5.3** Create error documentation
  - List all possible error codes
  - Explain resolution steps
  - Add debugging tips

---

## 📁 Project Structure

```
propertea/
├── backend/
│   ├── src/
│   │   ├── app.js (Express setup - READY)
│   │   ├── models/TeaCalculationOrchestrator.js (READY)
│   │   ├── services/ (10 core services - READY)
│   │   ├── descriptors/ (7 descriptor files - READY)
│   │   └── validation/ (Testing framework - READY)
│   └── server.js (Entry point - READY)
├── js/ (Reference matchers & descriptors - READY)
├── tea_validation_data.json (15 teas - READY)
├── test-validation-matchers.js (Active test - READY)
└── TODO.md (This file)
```

---

## 🔄 Recommended Workflow

### Week 1
1. **Day 1-2:** Implement Phase 1 (REST API endpoints)
   - 2 endpoints fully functional
   - Error handling complete
   - Ready for frontend integration

2. **Day 3-4:** Test Phase 1 thoroughly
   - Validate against dataset
   - Fix any edge cases
   - Document request/response examples

3. **Day 5:** Start Phase 2 (Text Generation)
   - Begin improving narratives
   - Can be done in parallel with Phase 1 fixes

### Week 2
4. **Days 6-8:** Complete Phase 2 + Phase 3 diagnosis
   - Better text generation
   - Identify algorithm issues
   - Plan fixes

5. **Days 9-10:** Implement Phase 3 improvements
   - Fix matching algorithms
   - Test improvements
   - Measure accuracy gains

### Ongoing
- Phase 4: Expand dataset as needed
- Phase 5: Documentation (after API is stable)

---

## 🚀 Getting Started

**Next Step:** Start Phase 1 by implementing `/api/tea/analyze` endpoint in `backend/src/app.js`

### Quick Checklist
- [ ] Read this TODO.md
- [ ] Review backend/src/app.js current structure
- [ ] Review TeaCalculationOrchestrator.js interface
- [ ] Begin Phase 1.1 implementation

---

## 📝 Notes

- **Validation Test:** `test-validation-matchers.js` can be run with `node test-validation-matchers.js`
- **API Logic:** All calculation logic is in `TeaCalculationOrchestrator` - just needs HTTP wrapper
- **Descriptors:** All reference data loaded from `backend/src/descriptors/`
- **Version:** Node.js 18+ required (uses ES modules)

---

## 🎯 Success Criteria

**Phase 1 Complete:**
- ✓ POST /api/tea/analyze accepts tea data
- ✓ Returns valid JSON response with analysis
- ✓ Handles errors gracefully
- ✓ Frontend can call endpoint successfully

**Phase 2 Complete:**
- ✓ Generated descriptions are compelling
- ✓ No generic placeholder text
- ✓ References tea characteristics

**Phase 3 Complete:**
- ✓ Activity accuracy > 40%
- ✓ Food accuracy > 30%
- ✓ Consistent improvements across tea types

**Phase 4 Complete:**
- ✓ 50+ teas in validation dataset
- ✓ All tea types represented
- ✓ Ground truth established

**Phase 5 Complete:**
- ✓ Swagger spec complete
- ✓ All endpoints documented
- ✓ Examples provided
