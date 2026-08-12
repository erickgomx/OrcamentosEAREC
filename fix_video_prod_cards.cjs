const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
`                {category === 'video_production' && (
                    <>
                        <ServiceCard 
                            active={serviceId === 'edit_only'} 
                            onClick={() => handleServiceSelect('edit_only', 'quantity')} 
                            onInfo={setInfoData} 
                            icon={Edit} 
                            title={TABLE.video_production.edit_only.label} 
                            price={\`R$ \${TABLE.video_production.edit_only.unit} / 1min\`} // FIX: Preço por minuto
                            composition={TABLE.video_production.edit_only.composition} 
                            desc={TABLE.video_production.edit_only.description} 
                        />
                        <ServiceCard active={serviceId === 'cam_cap'} onClick={() => handleServiceSelect('cam_cap', 'duration')} onInfo={setInfoData} icon={Video} title={TABLE.video_production.cam_cap.label} price={formatCurrency(TABLE.video_production.cam_cap.fixed)} composition={TABLE.video_production.cam_cap.composition} desc={TABLE.video_production.cam_cap.description} />
                        <ServiceCard active={serviceId === 'mobile_cap'} onClick={() => handleServiceSelect('mobile_cap', 'duration')} onInfo={setInfoData} icon={SmartphoneIcon} title={TABLE.video_production.mobile_cap.label} price={formatCurrency(TABLE.video_production.mobile_cap.fixed)} composition={TABLE.video_production.mobile_cap.composition} desc={TABLE.video_production.mobile_cap.description} />
                        <ServiceCard 
                            active={serviceId === 'drone'} 
                            onClick={() => handleServiceSelect('drone', 'quantity')} 
                            onInfo={setInfoData} 
                            icon={Plane} 
                            title={TABLE.video_production.drone.label} 
                            price={\`R$ \${TABLE.video_production.drone.fixed} / bateria\`}
                            composition={TABLE.video_production.drone.composition} 
                            desc={TABLE.video_production.drone.description} 
                        />
                        <ServiceCard active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                )}`,
`                {category === 'video_production' && (
                    <>
                        <ServiceCard 
                            active={serviceId === 'custom_bundle'} 
                            onClick={() => handleServiceSelect('custom_bundle', 'quantity')} 
                            onInfo={setInfoData} 
                            icon={Sparkles} 
                            title={TABLE.video_production.custom_bundle.label} 
                            price="Montar Agora"
                            composition={TABLE.video_production.custom_bundle.composition} 
                            desc={TABLE.video_production.custom_bundle.description} 
                            highlight
                        />
                    </>
                )}`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
