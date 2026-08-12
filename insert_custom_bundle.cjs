const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

const customBundleUI = `
                {isCustomBundle && setVideoQty && setDroneQty && (
                   <motion.div 
                        key="custom-bundle-selector"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-lg space-y-4"
                   >
                        <div className="bg-neutral-900/40 p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                            
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="text-brand-DEFAULT" size={20} />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">Quantidade de Fotos</h3>
                            </div>
                            <div className="flex items-center justify-between w-full gap-8 px-4">
                                <ControlBtn onClick={() => setQty(Math.max(0, qty - 1))} icon={Minus} />
                                <div className="text-center">
                                    <span className="block text-4xl font-serif text-white tracking-tighter mb-1 drop-shadow-lg">
                                        <AnimatedNumber value={qty} />
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group relative">
                                    <PriceTooltip value={25} />
                                    <ControlBtn onClick={() => setQty(qty + 1)} icon={Plus} active />
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-900/40 p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <Video className="text-brand-DEFAULT" size={20} />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">Quantidade de Vídeos</h3>
                            </div>
                            <div className="flex items-center justify-between w-full gap-8 px-4">
                                <ControlBtn onClick={() => setVideoQty(Math.max(0, videoQty - 1))} icon={Minus} />
                                <div className="text-center">
                                    <span className="block text-4xl font-serif text-white tracking-tighter mb-1 drop-shadow-lg">
                                        <AnimatedNumber value={videoQty} />
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group relative">
                                    <PriceTooltip value={350} />
                                    <ControlBtn onClick={() => setVideoQty(videoQty + 1)} icon={Plus} active />
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-900/40 p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <Battery className="text-brand-DEFAULT" size={20} />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">Baterias de Drone</h3>
                            </div>
                            <div className="flex items-center justify-between w-full gap-8 px-4">
                                <ControlBtn onClick={() => setDroneQty(Math.max(0, droneQty - 1))} icon={Minus} />
                                <div className="text-center">
                                    <span className="block text-4xl font-serif text-white tracking-tighter mb-1 drop-shadow-lg">
                                        <AnimatedNumber value={droneQty} />
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group relative">
                                    <PriceTooltip value={250} />
                                    <ControlBtn onClick={() => setDroneQty(droneQty + 1)} icon={Plus} active />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-neutral-900/40 p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden cursor-pointer hover:bg-neutral-800/40 transition-colors" onClick={() => setAddRealTime(!addRealTime)}>
                            <div className="flex items-center justify-between w-full px-2">
                                <div className="flex items-center gap-3">
                                    <Zap className={addRealTime ? "text-[#DC2626]" : "text-neutral-500"} size={24} />
                                    <div className="text-left">
                                        <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-neutral-200">Edição Real-time</h3>
                                        <p className="text-xs text-neutral-500">Entrega imediata (+ R$ 600)</p>
                                    </div>
                                </div>
                                <div className={\`w-6 h-6 rounded-md border flex items-center justify-center transition-colors \${addRealTime ? 'bg-[#DC2626] border-[#DC2626]' : 'border-neutral-600 bg-black/20'}\`}>
                                    {addRealTime && <Check size={14} className="text-white" />}
                                </div>
                            </div>
                        </div>
                   </motion.div>
                )}
`;

const target = `                   </motion.div>\n                )}`;

code = code.replace(target, target + customBundleUI);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
