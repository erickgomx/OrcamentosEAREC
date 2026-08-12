const fs = require('fs');
let code = fs.readFileSync('src/pages/QuoteView.tsx', 'utf8');

const travelCostCalc = `const travelCost = state.distance * 2 * state.quoteData.pricePerKm;`;
if (!code.includes(travelCostCalc)) {
    code = code.replace(
      `const actions = useQuoteLogic(props.clientData, props.quoteData);`,
      `const actions = useQuoteLogic(props.clientData, props.quoteData);\n  const travelCost = state.distance > 0 ? (state.distance * 2 * state.quoteData.pricePerKm) : 0;`
    );
}

// Fix UpsellList props
code = code.replace(
  `                      pricePerKm={state.quoteData.pricePerKm}
                      locationClient={props.clientData.location}
                      onOpenMap={() => actions.setIsMapOpen(true)}`,
  `                      travelCost={travelCost}
                      clientData={props.clientData}
                      isMapOpen={state.isMapOpen}
                      setIsMapOpen={actions.setIsMapOpen}
                      handleServiceSelect={(id, mode) => { actions.setServiceId(id); if (mode) actions.setSelectionMode(mode); }}`
);

fs.writeFileSync('src/pages/QuoteView.tsx', code);
