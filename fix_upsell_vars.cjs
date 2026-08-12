const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

// Replace locationClient with clientData?.location
code = code.replace(/locationClient/g, "clientData?.location");
code = code.replace(/onOpenMap\(\)/g, "setIsMapOpen(true)");
code = code.replace(/isNoTravelCost/g, "(travelCost === 0)");
code = code.replace(/<Plane /g, "<PlaneTakeoff ");
code = code.replace(/icon=\{Plane\}/g, "icon={PlaneTakeoff}");
code = code.replace(/<Timer /g, "<Clock ");

// Add helper variables after viewMode
const helpers = `
  const isDroneQuantity = category === 'video_production' && serviceId === 'drone';
  const isVideoQuantity = serviceId === 'comm_video';
  const minQty = (serviceId === 'comm_photo' ? 5 : (serviceId === 'comm_video' ? 1 : (serviceId === 'studio_photo' ? 8 : (category === 'video_production' ? 1 : 10))));
  const getIncrementPrice = (type: string) => {
    if (type === 'combo_photo') return 25;
    if (type === 'combo_video') return 350;
    if (type === 'qty') {
        if (serviceId === 'comm_photo' || serviceId === 'studio_photo') return 25;
        if (serviceId === 'comm_video') return 350;
        if (category === 'video_production' && serviceId === 'drone') return 250;
    }
    if (type === 'hours') {
        if (category === 'wedding') return 300;
        if (category === 'social') return 250;
        if (category === 'commercial' && serviceId === 'comm_event') return 250;
    }
    return 0;
  };
  const realTimePrice = AppConfig.PRICING_TABLE.wedding.realtime.fixed;
`;

code = code.replace(
    "const handleCustomProjectClick = () => {",
    helpers + "\n  const handleCustomProjectClick = () => {"
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
