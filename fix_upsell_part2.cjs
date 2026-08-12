const fs = require('fs');

const gridContent = `
            {category === 'commercial' && commercialMode && (
                <motion.div variants={fadeInUp} className="flex flex-col items-center mb-10 w-full max-w-3xl mx-auto">
                    <p className="text-center text-xs uppercase tracking-widest text-brand-DEFAULT mb-3 font-bold">Onde será o serviço?</p>
                    <div className="flex w-full bg-neutral-900 p-1.5 md:p-2 rounded-2xl border border-white/10 shadow-lg">
                        <button onClick={() => setCommercialMode('on_location')} className={cn("flex-1 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-2 md:gap-3 justify-center border", commercialMode === 'on_location' ? "bg-white text-black border-white shadow-lg scale-[1.02] z-10" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5")}>
                            <MapPin size={20} className={commercialMode === 'on_location' ? "text-brand-DEFAULT shrink-0" : "shrink-0"} />
                            NO COMÉRCIO
                        </button>
                        <button onClick={() => setCommercialMode('studio')} className={cn("flex-1 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-2 md:gap-3 justify-center border", commercialMode === 'studio' ? "bg-white text-black border-white shadow-lg scale-[1.02] z-10" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5")}>
                            <Building2 size={20} className={commercialMode === 'studio' ? "text-brand-DEFAULT shrink-0" : "shrink-0"} />
                            NO ESTÚDIO
                        </button>
                    </div>
                </motion.div>
            )}

            {selectionMode && (category === 'social') && (
                <motion.div variants={fadeInUp} className="flex flex-col items-center mb-10 w-full max-w-3xl mx-auto">
                    <p className="text-center text-xs uppercase tracking-widest text-brand-DEFAULT mb-3 font-bold">Como deseja contratar?</p>
                    <div className="flex w-full bg-neutral-900 p-1.5 md:p-2 rounded-2xl border border-white/10 shadow-lg">
                        <button onClick={() => setSelectionMode('duration')} className={cn("flex-1 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-2 md:gap-3 justify-center border", selectionMode === 'duration' ? "bg-white text-black border-white shadow-lg scale-[1.02] z-10" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5")}>
                            <Clock size={20} className={selectionMode === 'duration' ? "text-brand-DEFAULT shrink-0" : "shrink-0"} />
                            POR TEMPO
                        </button>
                        <button onClick={() => setSelectionMode('quantity')} className={cn("flex-1 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-2 md:gap-3 justify-center border", selectionMode === 'quantity' ? "bg-white text-black border-white shadow-lg scale-[1.02] z-10" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5")}>
                            <Camera size={20} className={selectionMode === 'quantity' ? "text-brand-DEFAULT shrink-0" : "shrink-0"} />
                            POR FOTO
                        </button>
                    </div>
                </motion.div>
            )}

            {!isCustomBundle && (
              <motion.div 
                  key="services-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className={gridClasses}
              >
                  {category === 'wedding' && (
                    <>
                        <ServiceCard active={serviceId === 'wedding_base'} onClick={() => handleServiceSelect('wedding_base')} onInfo={setInfoData} icon={Heart} title={TABLE.wedding.wedding_base.label} price={formatCurrency(TABLE.wedding.wedding_base.base)} composition={TABLE.wedding.wedding_base.composition} desc={TABLE.wedding.wedding_base.description} />
                        <ServiceCard active={serviceId === 'wedding_classic'} onClick={() => handleServiceSelect('wedding_classic')} onInfo={setInfoData} icon={Sparkles} title={TABLE.wedding.wedding_classic.label} price={formatCurrency(TABLE.wedding.wedding_classic.base)} composition={TABLE.wedding.wedding_classic.composition} desc={TABLE.wedding.wedding_classic.description} />
                        <ServiceCard active={serviceId === 'wedding_romance'} onClick={() => handleServiceSelect('wedding_romance')} onInfo={setInfoData} icon={Hand} title={TABLE.wedding.wedding_romance.label} price={formatCurrency(TABLE.wedding.wedding_romance.base)} composition={TABLE.wedding.wedding_romance.composition} desc={TABLE.wedding.wedding_romance.description} highlight />
                        <ServiceCard active={serviceId === 'wedding_essence'} onClick={() => handleServiceSelect('wedding_essence')} onInfo={setInfoData} icon={Gem} title={TABLE.wedding.wedding_essence.label} price={formatCurrency(TABLE.wedding.wedding_essence.base)} composition={TABLE.wedding.wedding_essence.composition} desc={TABLE.wedding.wedding_essence.description} highlight />
                        
                        <ServiceCard active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                  )}
                  {category === 'social' && (
                    <>
                        <ServiceCard active={serviceId === 'birthday'} onClick={() => handleServiceSelect('birthday', selectionMode || 'duration')} onInfo={setInfoData} icon={Gift} title={TABLE.social.birthday.label} price={selectionMode === 'duration' ? "A partir de R$ 400" : "R$ 25,00 / foto"} composition={selectionMode === 'duration' ? TABLE.social.birthday.composition : "Pague apenas pelo que amar."} desc={TABLE.social.birthday.description} />
                        <ServiceCard active={serviceId === 'event'} onClick={() => handleServiceSelect('event', selectionMode || 'duration')} onInfo={setInfoData} icon={Users} title={TABLE.social.event.label} price={selectionMode === 'duration' ? "A partir de R$ 600" : "R$ 25,00 / foto"} composition={selectionMode === 'duration' ? TABLE.social.event.composition : "Ideal para grandes eventos."} desc={TABLE.social.event.description} highlight />
                        <ServiceCard active={serviceId === 'party'} onClick={() => handleServiceSelect('party', selectionMode || 'duration')} onInfo={setInfoData} icon={GlassWater} title={TABLE.social.party.label} price={selectionMode === 'duration' ? "A partir de R$ 800" : "R$ 25,00 / foto"} composition={selectionMode === 'duration' ? TABLE.social.party.composition : "A melhor cobertura."} desc={TABLE.social.party.description} highlight />
                        
                        <ServiceCard active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                  )}
                  {category === 'commercial' && (
                    <>
                        <ServiceCard active={serviceId === 'comm_photo'} onClick={() => handleServiceSelect('comm_photo')} onInfo={setInfoData} icon={Camera} title={TABLE.commercial.comm_photo.label} price="R$ 25 / foto" composition={TABLE.commercial.comm_photo.composition} desc={TABLE.commercial.comm_photo.description} />
                        <ServiceCard active={serviceId === 'comm_video'} onClick={() => handleServiceSelect('comm_video')} onInfo={setInfoData} icon={Video} title={TABLE.commercial.comm_video.label} price="R$ 350 / vídeo" composition={TABLE.commercial.comm_video.composition} desc={TABLE.commercial.comm_video.description} highlight />
                        <ServiceCard active={serviceId === 'comm_combo'} onClick={() => handleServiceSelect('comm_combo')} onInfo={setInfoData} icon={Zap} title={TABLE.commercial.comm_combo.label} price="R$ 600 base" composition={TABLE.commercial.comm_combo.composition} desc={TABLE.commercial.comm_combo.description} highlight />
                    </>
                  )}
                  {category === 'studio' && (
                    <>
                        <ServiceCard active={serviceId === 'studio_photo'} onClick={() => handleServiceSelect('studio_photo')} onInfo={setInfoData} icon={Camera} title={TABLE.studio.studio_photo.label} price="R$ 200 base" composition={TABLE.studio.studio_photo.composition} desc={TABLE.studio.studio_photo.description} />
                        <ServiceCard active={serviceId === 'studio_video'} onClick={() => handleServiceSelect('studio_video')} onInfo={setInfoData} icon={Video} title={TABLE.studio.studio_video.label} price="R$ 350 base" composition={TABLE.studio.studio_video.composition} desc={TABLE.studio.studio_video.description} highlight />
                    </>
                  )}
                  {category === 'custom' && (
                      <motion.div variants={fadeInUp} className="!w-full !max-w-none col-span-2 md:col-span-2 lg:col-span-4 bg-white/5 border border-white/10 p-6 md:p-10 rounded-2xl text-center backdrop-blur-sm flex flex-col items-center justify-center h-full">
                          <Star className="mx-auto text-brand-DEFAULT mb-4" size={32} />
                          <h3 className="font-serif text-2xl text-white mb-2">Projeto Personalizado</h3>
                          <p className="text-neutral-400 mb-6 text-lg">Descreva sua necessidade específica no WhatsApp.</p>
                          <button 
                              className="bg-brand-DEFAULT hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors"
                              onClick={handleCustomProjectClick}
                          >
                              <MessageCircle size={22} />
                              Falar no WhatsApp
                          </button>
                      </motion.div>
                  )}
              </motion.div>
            )}
`;

let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

const target = `{isCustomBundle && setVideoQty && setDroneQty && (`;
code = code.replace(target, gridContent + '\n' + target);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
