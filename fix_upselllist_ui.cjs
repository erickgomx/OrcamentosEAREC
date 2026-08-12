const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

const newUI = `                  {category === 'video_production' && (
                    <motion.div 
                        key="video-prod-config"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-2xl bg-neutral-900/40 p-4 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col gap-6 backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                        
                        <div className="text-center mb-2">
                            <h3 className="font-serif text-2xl text-white">Monte seu Pacote</h3>
                            <p className="text-neutral-400 text-sm mt-2">Escolha as quantidades para cada serviço desejado.</p>
                        </div>

                        {/* Camera */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="p-3 bg-white/10 rounded-full text-white"><Camera size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold text-sm">Vídeo (Câmera)</h4>
                                    <p className="text-xs text-brand-DEFAULT mt-1">R$ 350 base (2h)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ControlBtn onClick={() => setCamCapHours?.(Math.max(0, (camCapHours || 0) - 1))} icon={Minus} />
                                <div className="w-16 text-center">
                                    <span className="text-2xl font-bold text-white"><AnimatedNumber value={camCapHours || 0} /></span>
                                    <span className="block text-[10px] text-neutral-500 uppercase">Horas</span>
                                </div>
                                <ControlBtn onClick={() => setCamCapHours?.((camCapHours || 0) + 1)} icon={Plus} active />
                            </div>
                        </div>

                        {/* Mobile */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="p-3 bg-white/10 rounded-full text-white"><Video size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold text-sm">Vídeo (Mobile)</h4>
                                    <p className="text-xs text-brand-DEFAULT mt-1">R$ 200 base (2h)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ControlBtn onClick={() => setMobileCapHours?.(Math.max(0, (mobileCapHours || 0) - 1))} icon={Minus} />
                                <div className="w-16 text-center">
                                    <span className="text-2xl font-bold text-white"><AnimatedNumber value={mobileCapHours || 0} /></span>
                                    <span className="block text-[10px] text-neutral-500 uppercase">Horas</span>
                                </div>
                                <ControlBtn onClick={() => setMobileCapHours?.((mobileCapHours || 0) + 1)} icon={Plus} active />
                            </div>
                        </div>

                        {/* Edit Only */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="p-3 bg-white/10 rounded-full text-white"><Zap size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold text-sm">Apenas Edição</h4>
                                    <p className="text-xs text-brand-DEFAULT mt-1">R$ 150 / vídeo</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ControlBtn onClick={() => setEditQty?.(Math.max(0, (editQty || 0) - 1))} icon={Minus} />
                                <div className="w-16 text-center">
                                    <span className="text-2xl font-bold text-white"><AnimatedNumber value={editQty || 0} /></span>
                                    <span className="block text-[10px] text-neutral-500 uppercase">Vídeos</span>
                                </div>
                                <ControlBtn onClick={() => setEditQty?.((editQty || 0) + 1)} icon={Plus} active />
                            </div>
                        </div>

                        {/* Drone */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="p-3 bg-white/10 rounded-full text-white"><PlaneTakeoff size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold text-sm">Drone (Aéreo)</h4>
                                    <p className="text-xs text-brand-DEFAULT mt-1">R$ 250 / bateria</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ControlBtn onClick={() => setDroneQty?.(Math.max(0, (droneQty || 0) - 1))} icon={Minus} />
                                <div className="w-16 text-center">
                                    <span className="text-2xl font-bold text-white"><AnimatedNumber value={droneQty || 0} /></span>
                                    <span className="block text-[10px] text-neutral-500 uppercase">Baterias</span>
                                </div>
                                <ControlBtn onClick={() => setDroneQty?.((droneQty || 0) + 1)} icon={Plus} active />
                            </div>
                        </div>

                    </motion.div>
                  )}`;

// Find the config viewMode and insert this ONLY if category === 'video_production'
// Actually, we can just replace the {showDuration} block logic
code = code.replace(
  `{showDuration && (`,
  `{category === 'video_production' && (\n` + newUI + `\n)}\n{category !== 'video_production' && showDuration && (`
);

// We also need to close it. But wait, `showQuantity` also exists.
// We should just hide both `showDuration` and `showQuantity` for `video_production` completely.
code = code.replace(
  `const showDuration = (selectionMode === 'duration' || (category === 'video_production' && ['cam_cap', 'mobile_cap'].includes(serviceId))) && !['custom_bundle'].includes(serviceId);`,
  `const showDuration = (selectionMode === 'duration') && !['custom_bundle'].includes(serviceId) && category !== 'video_production';`
);

code = code.replace(
  `const showQuantity = !['custom_bundle'].includes(serviceId) && (selectionMode === 'quantity' || ['commercial', 'studio'].includes(category) || (category === 'video_production' && ['drone', 'edit_only'].includes(serviceId)));`,
  `const showQuantity = !['custom_bundle'].includes(serviceId) && (selectionMode === 'quantity' || ['commercial', 'studio'].includes(category)) && category !== 'video_production';`
);

// Also remove the `video_production` specific cards from `viewMode === 'services'` since we skip it anyway.
const toRemove = `{category === 'video_production' && (
                    <>
                        <ServiceCard active={serviceId === 'cam_cap'} onClick={() => handleServiceSelect('cam_cap', 'duration')} onInfo={setInfoData} icon={Camera} title={TABLE.video_production.cam_cap.label} price="R$ 350 base" composition={TABLE.video_production.cam_cap.composition} desc={TABLE.video_production.cam_cap.description} />
                        <ServiceCard active={serviceId === 'mobile_cap'} onClick={() => handleServiceSelect('mobile_cap', 'duration')} onInfo={setInfoData} icon={Video} title={TABLE.video_production.mobile_cap.label} price="R$ 200 base" composition={TABLE.video_production.mobile_cap.composition} desc={TABLE.video_production.mobile_cap.description} />
                        <ServiceCard active={serviceId === 'drone'} onClick={() => handleServiceSelect('drone', 'quantity')} onInfo={setInfoData} icon={PlaneTakeoff} title={TABLE.video_production.drone.label} price="R$ 250 / bateria" composition={TABLE.video_production.drone.composition} desc={TABLE.video_production.drone.description} />
                        <ServiceCard active={serviceId === 'edit_only'} onClick={() => handleServiceSelect('edit_only', 'quantity')} onInfo={setInfoData} icon={Zap} title={TABLE.video_production.edit_only.label} price="R$ 150 / vídeo" composition={TABLE.video_production.edit_only.composition} desc={TABLE.video_production.edit_only.description} />
                    </>
                  )}`;
code = code.replace(toRemove, ``);

// Ensure the newUI is inside viewMode === 'config'
code = code.replace(
  `                {category !== 'video_production' && showDuration && (`,
  newUI + `\n                {category !== 'video_production' && showDuration && (`
);


fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
