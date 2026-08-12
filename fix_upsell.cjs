const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

// Replace isCustomBundle = false so everything else is normal
code = code.replace(
  `const isCustomBundle = category === 'video_production' || serviceId === 'custom_bundle';`,
  `const isCustomBundle = false; // Removido para usar o grid padrão`
);

// Add the video_production cards
const newCards = `                  {category === 'video_production' && (
                    <>
                        <ServiceCard active={serviceId === 'cam_cap'} onClick={() => handleServiceSelect('cam_cap', 'duration')} onInfo={setInfoData} icon={Camera} title={TABLE.video_production.cam_cap.label} price="R$ 350 base" composition={TABLE.video_production.cam_cap.composition} desc={TABLE.video_production.cam_cap.description} />
                        <ServiceCard active={serviceId === 'mobile_cap'} onClick={() => handleServiceSelect('mobile_cap', 'duration')} onInfo={setInfoData} icon={Video} title={TABLE.video_production.mobile_cap.label} price="R$ 200 base" composition={TABLE.video_production.mobile_cap.composition} desc={TABLE.video_production.mobile_cap.description} />
                        <ServiceCard active={serviceId === 'drone'} onClick={() => handleServiceSelect('drone', 'quantity')} onInfo={setInfoData} icon={PlaneTakeoff} title={TABLE.video_production.drone.label} price="R$ 250 / bateria" composition={TABLE.video_production.drone.composition} desc={TABLE.video_production.drone.description} />
                        <ServiceCard active={serviceId === 'edit_only'} onClick={() => handleServiceSelect('edit_only', 'quantity')} onInfo={setInfoData} icon={Zap} title={TABLE.video_production.edit_only.label} price="R$ 150 / vídeo" composition={TABLE.video_production.edit_only.composition} desc={TABLE.video_production.edit_only.description} />
                    </>
                  )}`;

// Find where to insert it: after {category === 'studio' && ( ... )}
const studioEndIdx = code.indexOf(`                  {category === 'custom' && (`);
if (studioEndIdx !== -1) {
    code = code.slice(0, studioEndIdx) + newCards + '\n' + code.slice(studioEndIdx);
}

// Remove the block of custom_bundle selector UI entirely
const customBundleSelectorStart = code.indexOf(`{isCustomBundle && setVideoQty && setDroneQty && (`);
if (customBundleSelectorStart !== -1) {
    // Find the end of this block
    // It ends with:
    //                 </motion.div>
    //             )}
    //        </motion.div>
    //      )}
    const endMatch = `                   </motion.div>\n                )}`;
    const customBundleSelectorEnd = code.indexOf(endMatch, customBundleSelectorStart);
    if (customBundleSelectorEnd !== -1) {
        code = code.slice(0, customBundleSelectorStart) + code.slice(customBundleSelectorEnd + endMatch.length);
    }
}

// Fix showQuantity
code = code.replace(
  `const showQuantity = !['custom_bundle', 'edit_only'].includes(serviceId) && (selectionMode === 'quantity' || ['commercial', 'studio'].includes(category));`,
  `const showQuantity = !['custom_bundle'].includes(serviceId) && (selectionMode === 'quantity' || ['commercial', 'studio'].includes(category) || (category === 'video_production' && ['drone', 'edit_only'].includes(serviceId)));`
);

// Fix showDuration
code = code.replace(
  `const showDuration = selectionMode === 'duration' && !['custom_bundle'].includes(serviceId);`,
  `const showDuration = (selectionMode === 'duration' || (category === 'video_production' && ['cam_cap', 'mobile_cap'].includes(serviceId))) && !['custom_bundle'].includes(serviceId);`
);

// Fix getIncrementPrice
code = code.replace(
  `        if (category === 'video_production' && serviceId === 'drone') return 250;`,
  `        if (category === 'video_production' && serviceId === 'drone') return 250;\n        if (category === 'video_production' && serviceId === 'edit_only') return 150;`
);

code = code.replace(
  `        if (category === 'commercial' && serviceId === 'comm_event') return 250;`,
  `        if (category === 'commercial' && serviceId === 'comm_event') return 250;\n        if (category === 'video_production') {\n            if (serviceId === 'cam_cap') return 200;\n            if (serviceId === 'mobile_cap') return 150;\n        }`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
