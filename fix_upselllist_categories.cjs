const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

// 1. Fix the interface
code = code.replace(
  `interface UpsellListProps {
  category: string;
  serviceId: string;`,
  `interface UpsellListProps {
  category: string;
  setCategory: (c: any) => void;
  serviceId: string;`
);

code = code.replace(
  `viewMode: 'services' | 'config';`,
  `viewMode: 'categories' | 'services' | 'config';`
);

// 2. Destructure setCategory
code = code.replace(
  `const UpsellList: React.FC<UpsellListProps> = (props) => {
  const {
    category, serviceId`,
  `const UpsellList: React.FC<UpsellListProps> = (props) => {
  const {
    category, setCategory, serviceId`
);

// 3. Add CategoryCard component before UpsellList
const categoryCardCode = `
const CategoryCard = ({ active, onClick, icon: Icon, label, desc, index }: any) => (
    <motion.div 
        custom={index}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }) }}
        onClick={onClick}
        className={cn(
            "group relative flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-500 cursor-pointer text-center h-full min-h-[220px] overflow-hidden",
            active 
                ? "bg-neutral-900 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.15)] scale-[1.02]" 
                : "bg-neutral-950/50 border-white/5 hover:border-white/20 hover:bg-neutral-900/80"
        )}
    >
        <div className={cn(
            "absolute top-3 right-3 w-6 h-6 rounded-full border flex items-center justify-center transition-all",
            active ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/10 bg-black/20"
        )}>
            {active && <Check size={14} className="text-white" />}
        </div>
        <div className={cn(
            "p-4 rounded-full mb-1 transition-all duration-300",
            active ? "bg-white/20 text-white" : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
        )}>
            <Icon size={28} />
        </div>
        <div className="space-y-1 text-center px-0 sm:px-1 w-full mt-2">
            <p className={cn(
                "text-[11px] sm:text-xs md:text-sm font-medium whitespace-normal leading-tight break-words",
                active ? "text-white" : "text-neutral-300"
            )}>
                {label}
            </p>
            <p className="text-[10px] md:text-xs text-neutral-500 font-normal">
                {desc}
            </p>
        </div>
    </motion.div>
);

`;

code = code.replace(
  `export const formatCurrency = (val: number) => {`,
  categoryCardCode + `export const formatCurrency = (val: number) => {`
);

// 4. Update the categories array to include icons
code = code.replace(
  `  const categories = [
    { id: 'wedding', label: 'Casamento', desc: 'Cobertura Completa' },
    { id: 'social', label: 'Social', desc: 'Aniversários e Festas' },
    { id: 'commercial', label: 'Comercial', desc: 'Marcas e Produtos' },
    { id: 'studio', label: 'Estúdio', desc: 'Retratos e Ensaios' },
    { id: 'video_production', label: 'Monte seu Orçamento', desc: 'Projetos Especiais' },
    { id: 'custom', label: 'Personalizado', desc: 'Outras Demandas' }
  ];`,
  `  const categories = [
    { id: 'wedding', label: 'Casamento', desc: 'Cobertura Completa', icon: Heart },
    { id: 'social', label: 'Social', desc: 'Aniversários e Festas', icon: Users },
    { id: 'commercial', label: 'Comercial', desc: 'Marcas e Produtos', icon: Building2 },
    { id: 'studio', label: 'Estúdio', desc: 'Retratos e Ensaios', icon: Camera },
    { id: 'video_production', label: 'Monte seu Orçamento', desc: 'Projetos Especiais', icon: Video },
    { id: 'custom', label: 'Personalizado', desc: 'Outras Demandas', icon: MessageCircle }
  ];`
);

// 5. Add the viewMode === 'categories' render block
const categoriesRenderCode = `
      {viewMode === 'categories' && (
        <motion.div
          key="categories-view"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="space-y-8 w-full flex flex-col items-center max-w-4xl mx-auto"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
                {categories.map((cat, i) => (
                    <CategoryCard 
                        key={cat.id}
                        {...cat}
                        active={category === cat.id}
                        onClick={() => setCategory(cat.id)}
                        index={i}
                    />
                ))}
            </div>
        </motion.div>
      )}
`;

code = code.replace(
  `      {viewMode === 'services' && (`,
  categoriesRenderCode + `      {viewMode === 'services' && (`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
