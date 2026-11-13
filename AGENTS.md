coba kamu ubah masing masing pagenya berdasar dari navbar dan detail pagenya ya, untuk codenya ini :
1. Kasir POS
<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0" name="viewport"><meta content="web_standard" name="shell-type"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"><link href="https://fonts.googleapis.com" rel="preconnect"><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"surface-container-high":"#f0e6e0","on-surface-variant":"#4d4540","surface-dim":"#e2d8d2","surface-container":"#f6ece6","outline-variant":"#d0c4be","primary":"#000000","on-primary-container":"#888380","surface-container-lowest":"#ffffff","tertiary-fixed":"#ffdbca","on-error-container":"#93000a","on-error":"#ffffff","on-secondary-fixed-variant":"#6e3900","on-tertiary-fixed":"#331200","on-background":"#1f1b17","surface-tint":"#625d5b","surface-container-low":"#fcf2eb","secondary":"#904d00","inverse-surface":"#342f2b","on-secondary-fixed":"#2f1500","on-secondary":"#ffffff","on-tertiary":"#ffffff","on-tertiary-fixed-variant":"#763300","on-secondary-container":"#663500","on-primary-fixed":"#1e1b19","error-container":"#ffdad6","outline":"#7e7570","surface":"#fff8f5","primary-container":"#1e1b19","background":"#fff8f5","secondary-fixed-dim":"#ffb77d","tertiary":"#000000","on-primary-fixed-variant":"#4a4643","secondary-container":"#fe932c","secondary-fixed":"#ffdcc3","surface-bright":"#fff8f5","tertiary-container":"#331200","surface-variant":"#eae1da","on-surface":"#1f1b17","surface-container-highest":"#eae1da","on-tertiary-container":"#cf6721","primary-fixed-dim":"#ccc5c2","error":"#ba1a1a","primary-fixed":"#e9e1dd","tertiary-fixed-dim":"#ffb68e","on-primary":"#ffffff","inverse-primary":"#ccc5c2","inverse-on-surface":"#f9efe8"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"space-xl":"2rem","gutter-desktop":"1.5rem","space-sm":"0.5rem","margin-desktop":"2rem","space-lg":"1.5rem","space-xs":"0.25rem","margin":"1rem","gutter":"1rem","space-md":"1rem"},"fontFamily":{"headline-xl":["Plus Jakarta Sans"],"label-sm":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"],"headline-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"numeric-pos":["Plus Jakarta Sans"],"label-lg":["Plus Jakarta Sans"],"display-lg":["Plus Jakarta Sans"],"body-sm":["Plus Jakarta Sans"],"label-md":["Plus Jakarta Sans"]},"fontSize":{"headline-xl":["28px",{"lineHeight":"36px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-sm":["11px",{"lineHeight":"14px","letterSpacing":"0.04em","fontWeight":"600"}],"body-md":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["22px",{"lineHeight":"30px","letterSpacing":"-0.015em","fontWeight":"600"}],"headline-md":["18px",{"lineHeight":"26px","letterSpacing":"-0.01em","fontWeight":"600"}],"body-lg":["16px",{"lineHeight":"24px","fontWeight":"400"}],"numeric-pos":["24px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-lg":["14px",{"lineHeight":"20px","letterSpacing":"0.01em","fontWeight":"600"}],"display-lg":["36px",{"lineHeight":"44px","letterSpacing":"-0.03em","fontWeight":"700"}],"body-sm":["12px",{"lineHeight":"18px","fontWeight":"400"}],"label-md":["12px",{"lineHeight":"16px","letterSpacing":"0.02em","fontWeight":"600"}]}}}}</script></head><body class="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed"><header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(28,25,23,0.04)]"><div class="h-16 w-full px-6 flex items-center justify-between gap-4 border-b border-surface-container-high/60"><div class="flex items-center gap-3 min-w-max"><div class="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm shrink-0"><span class="material-symbols-outlined text-[20px]">local_cafe</span></div><div class="flex items-center gap-2.5"><span class="font-bold text-[16px] text-on-surface tracking-tight">POS Kafe</span><span class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium text-[11px]">Cabang Senopati</span><div class="flex items-center gap-1.5 pl-1"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span class="text-[11px] font-medium text-emerald-600">Online</span></div></div></div><nav class="hidden xl:flex items-center bg-surface-container-low p-1 rounded-xl gap-1" data-active-classes="bg-primary-container text-on-primary font-medium"><a aria-current="page" class="px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 bg-primary text-on-primary font-medium text-[13px] shadow-sm" data-path="kasir-pos" href="#"><span class="material-symbols-outlined text-[17px]">point_of_sale</span><span>Kasir POS</span></a><a class="px-4 py-1.5 rounded-lg font-medium text-[13px] text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-2" data-path="katalog-menu" href="#"><span class="material-symbols-outlined text-[17px]">menu_book</span><span>Katalog Menu</span></a><a class="px-4 py-1.5 rounded-lg font-medium text-[13px] text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-2" data-path="laporan-penjualan" href="#"><span class="material-symbols-outlined text-[17px]">bar_chart</span><span>Laporan Penjualan</span></a><a class="px-4 py-1.5 rounded-lg font-medium text-[13px] text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-2" data-path="insight-bisnis" href="#"><span class="material-symbols-outlined text-[17px]">auto_awesome</span><span>Insight Bisnis</span></a></nav><div class="flex items-center gap-3 min-w-max"><div class="flex items-center gap-2.5 px-3 py-1.5 bg-surface-container-low rounded-xl border border-surface-container"><div class="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-[11px] shrink-0">BS</div><div class="flex flex-col text-right leading-tight"><span class="font-semibold text-[13px] text-on-surface">Budi Santoso</span><span class="text-[11px] text-secondary font-medium">Shift Pagi</span></div></div><button class="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-medium text-[12px] transition-all active:scale-[0.98] border border-surface-container-high" type="button"><span class="material-symbols-outlined text-[16px] text-on-surface-variant">lock</span><span>Kunci Kasir</span></button></div></div></header><main class="w-full bg-surface min-h-screen pt-16"><div class="flex flex-col w-full">
<!-- Interactive Barista Quick Banner & System Status -->

<!-- Main Split Layout -->
<div class="w-full px-space-md lg:px-space-xl py-space-sm pb-12 grid grid-cols-1 xl:grid-cols-12 gap-gutter-desktop items-start">
<!-- LEFT PANEL: Catalog, Search & Product Grid (approx 65% / 8 cols) -->
<section class="xl:col-span-8 flex flex-col gap-space-md min-w-0">
<!-- Top Action Bar: Search & Shortcut Hint -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-space-md"><div class="relative w-full flex-1"><span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span><input class="w-full pl-11 pr-24 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary transition-all" id="pos-search-input" placeholder="Cari menu atau ketik ⌘K..." type="text"><div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5"><kbd class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">⌘K</kbd></div></div></div>
<!-- Category Filter Pills Bar -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
<button class="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shrink-0 shadow-sm flex items-center gap-2 transition-transform active:scale-95">
<span>Semua Kategori</span>
<span class="px-1.5 py-0.5 rounded-full bg-surface-container-high/30 text-on-primary font-label-sm text-[10px]">24</span>
</button>
<button class="px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md shrink-0 shadow-sm flex items-center gap-2 transition-all">
<span class="material-symbols-outlined text-[16px] text-secondary">coffee</span>
<span>Espresso Base</span>
<span class="px-1.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-[10px]">8</span>
</button>
<button class="px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md shrink-0 shadow-sm flex items-center gap-2 transition-all">
<span class="material-symbols-outlined text-[16px] text-secondary">water_drop</span>
<span>Manual Brew</span>
<span class="px-1.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-[10px]">5</span>
</button>
<button class="px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md shrink-0 shadow-sm flex items-center gap-2 transition-all">
<span class="material-symbols-outlined text-[16px] text-secondary">emoji_food_beverage</span>
<span>Non-Coffee &amp; Tea</span>
<span class="px-1.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-[10px]">6</span>
</button>
<button class="px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md shrink-0 shadow-sm flex items-center gap-2 transition-all">
<span class="material-symbols-outlined text-[16px] text-secondary">bakery_dining</span>
<span>Pastry &amp; Food</span>
<span class="px-1.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-[10px]">5</span>
</button>
</div>
<!-- Menu Items Grid (Responsive 2 to 4 columns) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md"><div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99]" onclick="simulateAddToCart('Iced Caramel Macchiato', 38000)"><div class="relative h-36 w-full overflow-hidden bg-surface-container"><img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Artisanal iced caramel macchiato coffee" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9jkNOdrfJaemvuD3a1RXfdU7jJ_JG4DVBoYUmfdTtlHCXRwvZblCJ1MMtJ1I4cm8j-5VOdLcmvQUsasrgUWcejkayx6GsB4bJe-XQdCZiIuQGrp_nsyOMRw7iEulxaUxPYXQWVNRsld7X_kXrOasvV58oqYrUge9cbWy8jJ3c3xSCdWHYynYB89TRsyFR3trdiM8zziP0JeN398w1lmdyDGGPP0o085uWM7W2YTPq"></div><div class="p-3.5 flex flex-col justify-between flex-1 gap-2"><div><h3 class="font-headline-md text-body-lg font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">Iced Caramel Macchiato</h3><p class="font-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-0.5">Espresso blend, vanilla, salted caramel</p></div><div class="flex items-center justify-between pt-1.5 border-0"><span class="font-headline-md text-headline-md font-bold text-on-surface">Rp 38.000</span><button class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add</span></button></div></div></div><div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99]" onclick="simulateAddToCart('Espresso Double Shot', 25000)"><div class="relative h-36 w-full overflow-hidden bg-surface-container"><img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Double espresso shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDljjNWry3VyExrzPDETu5AmrREYjfG50Veq2o85ADQeUqRF-qAWH2C9EyBZtlrxHS5ZCBEX2A1v6WoSQ-dJCr0k7N11HRFkaCUWdM_OoHB_rjTmU2T0u0vVDkCatjJKXen2jHiaOayaQ6m_LWezP9D5OhtOCjHVirQSbRc5H9n4pdaWPxN1U75tcEqPDjnWplLBB4iOx3a4zQ9gWplZKFg_7GxIvOyohSYKJh57K5"></div><div class="p-3.5 flex flex-col justify-between flex-1 gap-2"><div><h3 class="font-headline-md text-body-lg font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">Espresso Double Shot</h3><p class="font-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-0.5">House blend Flores Bajawa &amp; Gayo</p></div><div class="flex items-center justify-between pt-1.5 border-0"><span class="font-headline-md text-headline-md font-bold text-on-surface">Rp 25.000</span><button class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add</span></button></div></div></div><div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99]" onclick="simulateAddToCart('Creamy Aren Latte', 32000)"><div class="relative h-36 w-full overflow-hidden bg-surface-container"><img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Signature brown sugar palm latte" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjYRmgt1fi_jWHQxaZNLRThpVwZtgEp8czi9Ai2BadqIglTP-EL5fk5GbFLRkYVoS7l4Mwd4qB2m0URR4Z3WgPJokPzsebnfLMmiWHZnAcOqLA5NaCbr3iycFHNUkMNj2dBQyvpEkwx_2t0XlA_eBiPltF_x3Ro28DKnf8DZFuhkcQoRVOBKBnNiVMvZhFoFqtskEjbnWT0CquRFN2UlmUZAR0Oej5ff3I8aNLkGpe"></div><div class="p-3.5 flex flex-col justify-between flex-1 gap-2"><div><h3 class="font-headline-md text-body-lg font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">Creamy Aren Latte</h3><p class="font-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-0.5">Espresso, susu segar, aren murni</p></div><div class="flex items-center justify-between pt-1.5 border-0"><span class="font-headline-md text-headline-md font-bold text-on-surface">Rp 32.000</span><button class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add</span></button></div></div></div><div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99]" onclick="simulateAddToCart('Matcha Oat Latte', 36000)"><div class="relative h-36 w-full overflow-hidden bg-surface-container"><img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Matcha latte" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQrOTBC9SfI2Qp76t6tSaA0hgc8R1jOL9aCkExIATAyqD8c6ySXDLEo1828vsAH7aZk4bzU6QTuN6Edhzglk8wnvV3XuDxjeoYR1ci54_WdhhgCRx9yj76garKhks5bGg-PaFRQg7KcOq9-QsjswPbVDYOMmgZ-2PQRZTfby0FmTnlZlaIkkuDVu6PeOb_jenie-nvwvHFZri42ZY6XohVnb1AwzE7mrCUAwZ81VK1"></div><div class="p-3.5 flex flex-col justify-between flex-1 gap-2"><div><h3 class="font-headline-md text-body-lg font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">Matcha Oat Latte</h3><p class="font-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-0.5">Pure ceremonial matcha &amp; creamy oat</p></div><div class="flex items-center justify-between pt-1.5 border-0"><span class="font-headline-md text-headline-md font-bold text-on-surface">Rp 36.000</span><button class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add</span></button></div></div></div><div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99]" onclick="simulateAddToCart('Almond Croissant', 28000)"><div class="relative h-36 w-full overflow-hidden bg-surface-container"><img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Almond croissant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvWspS1_m8elgXZCgQB1xy7RBw8XNN7qA-M3bK4RNJaC-RGrl4zAtYCJixu3rOaCuZohyRhmm3na9-v363Pqcr3pLitV63Wt3oLS8WXMeknzknXTErqfGJKKx8SUfQHY-JWBY8tJE_6xZT_HwVZpFtkdy4u9M_frXjQw-5NwsrvhfurRbtHmQZd9JPbJXtjNHS000ePFBQWJd5xgeuMtK0lq6a3wRrnqoDO1Is9Dio"></div><div class="p-3.5 flex flex-col justify-between flex-1 gap-2"><div><h3 class="font-headline-md text-body-lg font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">Almond Croissant</h3><p class="font-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-0.5">Almond frangipane paste, butter crust</p></div><div class="flex items-center justify-between pt-1.5 border-0"><span class="font-headline-md text-headline-md font-bold text-on-surface">Rp 28.000</span><button class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add</span></button></div></div></div><div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99]" onclick="simulateAddToCart('V60 Gayo Winey', 42000)"><div class="relative h-36 w-full overflow-hidden bg-surface-container"><img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="V60 coffee" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBHac83-USmMv4tno8mYMnEO3d8qfrTCMPwvVOybXPtW4pJbDWlmX0liiyWSFynoRn8fDi_Kle45XzqqdYbnq4KMX3-v7Q2MxA_6Fk3RPJdqa4UKl45xLbF9krb21yAgsR9891GyIrQ16VpDE8Gon-KzMybTMMyk6H9hmFJpwYNJy1dMpOWJjZreYyyT1SYsdwwWzhQapC51kxCRYsM-bqWoreCeSVKMN-_rXjBS5i"></div><div class="p-3.5 flex flex-col justify-between flex-1 gap-2"><div><h3 class="font-headline-md text-body-lg font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">V60 Gayo Winey</h3><p class="font-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-0.5">Single origin, blackcurrant &amp; honey</p></div><div class="flex items-center justify-between pt-1.5 border-0"><span class="font-headline-md text-headline-md font-bold text-on-surface">Rp 42.000</span><button class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add</span></button></div></div></div><div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99]" onclick="simulateAddToCart('Avocado Cold Brew', 40000)"><div class="relative h-36 w-full overflow-hidden bg-surface-container"><img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Avocado cold brew" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD99Pu-NGDS0Kfu20tmRyQmJptvzCHTYxAJ1TPlgjiSm3zohPzjxCI4TLOT1gE-0zY4Wo6tNZbCwC1ZMI2gq2iarDawSZDHdwYxEzmcvJOx8VmnbzU-Cm6tfHqa3VkVTGh1K18iKbTyR8IydHRy1poUlpAbQWqtH2jgahOg1qw9vmVfCutsbMZHObU_8sSa2KooQSFJxLLjmWvktV7K5h-yis2Diu06un2Q-OdMt2K_"></div><div class="p-3.5 flex flex-col justify-between flex-1 gap-2"><div><h3 class="font-headline-md text-body-lg font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">Avocado Cold Brew</h3><p class="font-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-0.5">Alpukat mentega, 12h cold brew</p></div><div class="flex items-center justify-between pt-1.5 border-0"><span class="font-headline-md text-headline-md font-bold text-on-surface">Rp 40.000</span><button class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add</span></button></div></div></div><div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer active:scale-[0.99]" onclick="simulateAddToCart('Pain Au Chocolat', 30000)"><div class="relative h-36 w-full overflow-hidden bg-surface-container"><img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Pain au chocolat" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_r-7h2HY6MmHpRCBEmJzE5SObEqPCJb1KF0trVAKhG53EQ8bMX15zgdePqxbm4t52hvEwQcRVYQRegaWna6QyhfYNw43mDHvz1PRHxci4n_IAXKTQrZ3z4cHWOBb5plxrVRoW-ToMmTXm60RSHzqDqQ4JK7sn5IXyjfKoNpxViUhHRs17n-pgUiM7S7lV2G1-Zvhlhr7ofsu0I6A_-jcTYWo_B-nNHKF9mzVCLPv4"></div><div class="p-3.5 flex flex-col justify-between flex-1 gap-2"><div><h3 class="font-headline-md text-body-lg font-semibold text-on-surface leading-tight line-clamp-1 group-hover:text-secondary transition-colors">Pain Au Chocolat</h3><p class="font-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-0.5">Belgian chocolate, french butter</p></div><div class="flex items-center justify-between pt-1.5 border-0"><span class="font-headline-md text-headline-md font-bold text-on-surface">Rp 30.000</span><button class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-all shadow-sm" type="button"><span class="material-symbols-outlined text-[18px]">add</span></button></div></div></div></div>
<!-- Quick Add Custom / Barista Manual Input -->
<div class="p-4 bg-surface-container-low rounded-xl flex items-center justify-between shadow-sm">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm">
<span class="material-symbols-outlined text-[22px]">tune</span>
</div>
<div>
<h4 class="font-label-lg text-label-lg text-on-surface">Item Kustom / Open Price</h4>
<p class="font-body-sm text-on-surface-variant text-[12px]">Untuk pesanan seasonal atau permintaan khusus pelanggan</p>
</div>
</div>
<button class="px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
          Input Manual
        </button>
</div>
</section>
<!-- RIGHT PANEL: Active Order Cart & Terminal Checkout (approx 35% / 4 cols) -->
<aside class="xl:col-span-4 sticky top-24 flex flex-col gap-space-md">
<div class="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-md flex flex-col"><div class="flex items-center justify-between pb-3"><div class="flex items-center gap-2"><h2 class="font-headline-md text-headline-md font-bold text-on-surface">Pesanan Aktif</h2><span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-[11px]">3 Item</span></div><button class="text-outline hover:text-error transition-colors p-1 rounded-lg hover:bg-surface-container-low" title="Bersihkan Pesanan" type="button"><span class="material-symbols-outlined text-[20px]">delete_sweep</span></button></div><div class="grid grid-cols-2 p-1 rounded-xl bg-surface-container-low mb-3"><button class="py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5" type="button"><span class="material-symbols-outlined text-[16px] text-secondary">table_restaurant</span><span>Meja 04</span></button><button class="py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors" type="button"><span class="material-symbols-outlined text-[16px]">shopping_bag</span><span>Take Away</span></button></div><div class="flex flex-col gap-2 max-h-[290px] overflow-y-auto pr-1"><div class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between"><div class="min-w-0 flex-1"><h4 class="font-label-md text-label-md font-semibold text-on-surface truncate">Creamy Aren Latte</h4><span class="font-body-sm text-on-surface-variant text-[11px]">Less Sugar (70%)</span></div><div class="flex items-center gap-3 shrink-0"><div class="flex items-center bg-surface-container-lowest rounded-lg p-0.5 shadow-sm"><button class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container transition-all" type="button"><span class="material-symbols-outlined text-[13px]">remove</span></button><span class="w-6 text-center font-label-sm text-label-sm text-on-surface">2</span><button class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container transition-all" type="button"><span class="material-symbols-outlined text-[13px]">add</span></button></div><span class="font-label-md text-label-md font-bold text-on-surface w-16 text-right">64.000</span></div></div><div class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between"><div class="min-w-0 flex-1"><h4 class="font-label-md text-label-md font-semibold text-on-surface truncate">Almond Croissant</h4><span class="font-body-sm text-on-surface-variant text-[11px]">Heated Serve</span></div><div class="flex items-center gap-3 shrink-0"><div class="flex items-center bg-surface-container-lowest rounded-lg p-0.5 shadow-sm"><button class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container transition-all" type="button"><span class="material-symbols-outlined text-[13px]">remove</span></button><span class="w-6 text-center font-label-sm text-label-sm text-on-surface">1</span><button class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container transition-all" type="button"><span class="material-symbols-outlined text-[13px]">add</span></button></div><span class="font-label-md text-label-md font-bold text-on-surface w-16 text-right">28.000</span></div></div><div class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between"><div class="min-w-0 flex-1"><h4 class="font-label-md text-label-md font-semibold text-on-surface truncate">Matcha Oat Latte</h4><span class="font-body-sm text-on-surface-variant text-[11px]">Normal Ice</span></div><div class="flex items-center gap-3 shrink-0"><div class="flex items-center bg-surface-container-lowest rounded-lg p-0.5 shadow-sm"><button class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container transition-all" type="button"><span class="material-symbols-outlined text-[13px]">remove</span></button><span class="w-6 text-center font-label-sm text-label-sm text-on-surface">1</span><button class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container transition-all" type="button"><span class="material-symbols-outlined text-[13px]">add</span></button></div><span class="font-label-md text-label-md font-bold text-on-surface w-16 text-right">36.000</span></div></div></div><div class="mt-3 pt-3 flex flex-col gap-1.5"><div class="flex justify-between items-center text-body-sm text-on-surface-variant"><span>Subtotal</span><span class="font-label-md text-on-surface">Rp 128.000</span></div><div class="flex justify-between items-center text-body-sm text-on-surface-variant"><span>PB1 (10%)</span><span class="font-label-md text-on-surface">Rp 12.800</span></div><div class="flex justify-between items-center text-body-sm text-secondary font-medium"><span>Diskon Member</span><span>-Rp 10.000</span></div><div class="pt-2 mt-1 flex justify-between items-baseline"><span class="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider font-semibold">Total</span><span class="font-display-lg text-[26px] leading-tight font-bold text-on-surface tracking-tight" id="total-amount-display">Rp 130.800</span></div></div><div class="mt-3"><div class="grid grid-cols-2 gap-1.5 p-1 bg-surface-container-low rounded-xl"><button class="p-2 rounded-lg bg-surface-container-lowest shadow-sm font-label-md text-label-md text-on-surface flex items-center justify-center gap-1.5 font-semibold" type="button"><span class="material-symbols-outlined text-[18px]">payments</span><span>Tunai</span></button><button class="p-2 rounded-lg hover:bg-surface-container font-label-md text-label-md text-on-surface-variant flex items-center justify-center gap-1.5 transition-all" type="button"><span class="material-symbols-outlined text-[18px] text-secondary">qr_code_scanner</span><span>QRIS</span></button><button class="p-2 rounded-lg hover:bg-surface-container font-label-md text-label-md text-on-surface-variant flex items-center justify-center gap-1.5 transition-all" type="button"><span class="material-symbols-outlined text-[18px] text-secondary">credit_card</span><span>EDC / Kartu</span></button><button class="p-2 rounded-lg hover:bg-surface-container font-label-md text-label-md text-on-surface-variant flex items-center justify-center gap-1.5 transition-all" type="button"><span class="material-symbols-outlined text-[18px] text-secondary">account_balance</span><span>Transfer</span></button></div></div><div class="mt-4 flex flex-col gap-2"><button class="w-full py-3 px-4 rounded-xl bg-primary hover:bg-secondary text-on-primary font-headline-md text-body-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]" id="btn-confirm-pay" onclick="triggerCheckoutFeedback()" type="button"><span class="material-symbols-outlined text-[20px]">print</span><span>Bayar Rp 130.800</span></button><div class="grid grid-cols-2 gap-2"><button class="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all flex items-center justify-center gap-1" type="button"><span class="material-symbols-outlined text-[16px]">pause</span><span>Hold</span></button><button class="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all flex items-center justify-center gap-1" type="button"><span class="material-symbols-outlined text-[16px]">person</span><span>Member</span></button></div></div></div>
</aside>
</div>
</div>
<script>
  function simulateAddToCart(itemName, itemPrice) {
    const totalDisplay = document.getElementById('total-amount-display');
    const payBtn = document.getElementById('btn-confirm-pay');
    
    // Quick micro-pulse feedback
    if (totalDisplay) {
      totalDisplay.classList.add('text-secondary');
      setTimeout(() => {
        totalDisplay.classList.remove('text-secondary');
      }, 300);
    }
  }

  function setCashTender(amount) {
    const billTotal = 130800;
    const change = Math.max(0, amount - billTotal);
    const kembalianDisplay = document.getElementById('kembalian-display');
    if (kembalianDisplay) {
      kembalianDisplay.innerText = 'Rp ' + change.toLocaleString('id-ID');
      kembalianDisplay.classList.add('text-secondary');
    }
  }

  function triggerCheckoutFeedback() {
    const btn = document.getElementById('btn-confirm-pay');
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.innerHTML = `
      <span class="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
      <span>Memproses Struk Thermal...</span>
    `;
    btn.classList.add('opacity-80', 'pointer-events-none');

    setTimeout(() => {
      btn.innerHTML = `
        <span class="material-symbols-outlined text-[22px]">check_circle</span>
        <span>Pesanan Berhasil Diselesaikan!</span>
      `;
      btn.classList.remove('bg-secondary-container', 'opacity-80');
      btn.classList.add('bg-primary');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-primary', 'pointer-events-none');
        btn.classList.add('bg-secondary-container');
      }, 1800);
    }, 1000);
  }

  // Keyboard shortcut listener for rapid POS workflows (Enter & Cmd/Ctrl+K)
  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchBox = document.getElementById('pos-search-input');
      if (searchBox) searchBox.focus();
    }
  });
</script></main><footer class="w-full bg-surface-container-lowest py-space-md mt-auto"><div class="w-full px-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm"><div>© 2025 POS Kafe Specialty Coffee. All rights reserved. Senopati Roastery.</div><div class="flex items-center gap-space-md"><span>Versi Terminal 2.4.0</span><span>Koneksi EDC: Terhubung</span></div></div></footer>

</body></html>

2. Katalog Menu
<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0" name="viewport"><meta content="web_standard" name="shell-type"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"><link href="https://fonts.googleapis.com" rel="preconnect"><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"surface-container-high":"#f0e6e0","on-surface-variant":"#4d4540","surface-dim":"#e2d8d2","surface-container":"#f6ece6","outline-variant":"#d0c4be","primary":"#000000","on-primary-container":"#888380","surface-container-lowest":"#ffffff","tertiary-fixed":"#ffdbca","on-error-container":"#93000a","on-error":"#ffffff","on-secondary-fixed-variant":"#6e3900","on-tertiary-fixed":"#331200","on-background":"#1f1b17","surface-tint":"#625d5b","surface-container-low":"#fcf2eb","secondary":"#904d00","inverse-surface":"#342f2b","on-secondary-fixed":"#2f1500","on-secondary":"#ffffff","on-tertiary":"#ffffff","on-tertiary-fixed-variant":"#763300","on-secondary-container":"#663500","on-primary-fixed":"#1e1b19","error-container":"#ffdad6","outline":"#7e7570","surface":"#fff8f5","primary-container":"#1e1b19","background":"#fff8f5","secondary-fixed-dim":"#ffb77d","tertiary":"#000000","on-primary-fixed-variant":"#4a4643","secondary-container":"#fe932c","secondary-fixed":"#ffdcc3","surface-bright":"#fff8f5","tertiary-container":"#331200","surface-variant":"#eae1da","on-surface":"#1f1b17","surface-container-highest":"#eae1da","on-tertiary-container":"#cf6721","primary-fixed-dim":"#ccc5c2","error":"#ba1a1a","primary-fixed":"#e9e1dd","tertiary-fixed-dim":"#ffb68e","on-primary":"#ffffff","inverse-primary":"#ccc5c2","inverse-on-surface":"#f9efe8"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"space-xl":"2rem","gutter-desktop":"1.5rem","space-sm":"0.5rem","margin-desktop":"2rem","space-lg":"1.5rem","space-xs":"0.25rem","margin":"1rem","gutter":"1rem","space-md":"1rem"},"fontFamily":{"headline-xl":["Plus Jakarta Sans"],"label-sm":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"],"headline-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"numeric-pos":["Plus Jakarta Sans"],"label-lg":["Plus Jakarta Sans"],"display-lg":["Plus Jakarta Sans"],"body-sm":["Plus Jakarta Sans"],"label-md":["Plus Jakarta Sans"]},"fontSize":{"headline-xl":["28px",{"lineHeight":"36px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-sm":["11px",{"lineHeight":"14px","letterSpacing":"0.04em","fontWeight":"600"}],"body-md":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["22px",{"lineHeight":"30px","letterSpacing":"-0.015em","fontWeight":"600"}],"headline-md":["18px",{"lineHeight":"26px","letterSpacing":"-0.01em","fontWeight":"600"}],"body-lg":["16px",{"lineHeight":"24px","fontWeight":"400"}],"numeric-pos":["24px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-lg":["14px",{"lineHeight":"20px","letterSpacing":"0.01em","fontWeight":"600"}],"display-lg":["36px",{"lineHeight":"44px","letterSpacing":"-0.03em","fontWeight":"700"}],"body-sm":["12px",{"lineHeight":"18px","fontWeight":"400"}],"label-md":["12px",{"lineHeight":"16px","letterSpacing":"0.02em","fontWeight":"600"}]}}}}</script></head><body class="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed"><header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest border-b border-surface-container shadow-[0_1px_4px_rgba(28,25,23,0.03)]"><div class="h-16 w-full px-6 flex items-center justify-between gap-space-md"><div class="flex items-center gap-3 min-w-max"><div class="flex items-center gap-2.5"><div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-[15px] shadow-sm">P</div><div class="flex flex-col"><div class="flex items-center gap-2"><span class="font-headline-md text-[16px] text-on-surface font-bold tracking-tight">POS Kafe</span><span class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px]">Cabang Senopati</span></div><div class="flex items-center gap-1.5 text-on-surface-variant text-[12px]"><span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span><span class="font-body-sm text-[11px]">Kasir 01 • 10:42 WIB Online</span></div></div></div></div><nav class="hidden xl:flex items-center p-1 bg-surface-container-low rounded-xl gap-1"><a class="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all flex items-center gap-1.5" data-path="kasir-pos" href="#"><span class="material-symbols-outlined text-[18px]">point_of_sale</span><span>Kasir POS</span></a><a aria-current="page" class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md shadow-sm" data-path="katalog-menu" href="#"><span class="material-symbols-outlined text-[18px]">menu_book</span><span>Katalog Menu</span></a><a class="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all flex items-center gap-1.5" data-path="laporan-penjualan" href="#"><span class="material-symbols-outlined text-[18px]">bar_chart</span><span>Laporan Penjualan</span></a><a class="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all flex items-center gap-1.5" data-path="insight-bisnis" href="#"><span class="material-symbols-outlined text-[18px]">auto_awesome</span><span>Insight Bisnis</span></a></nav><div class="flex items-center gap-2.5 min-w-max"><div class="flex items-center gap-2 pl-3 pr-2 py-1 bg-surface-container-low rounded-xl"><div class="flex flex-col text-right"><span class="font-label-md text-label-md text-on-surface font-medium leading-tight">Budi Santoso</span><span class="font-body-sm text-[11px] text-secondary font-medium leading-tight">Shift Pagi (Aktif)</span></div><div class="w-7 h-7 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center font-bold text-[11px] ring-1 ring-secondary-container/40">BS</div></div><button class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-all active:scale-[0.98]" type="button"><span class="material-symbols-outlined text-[16px] text-on-surface-variant">lock</span><span>Kunci Kasir</span></button></div></div></header><main class="w-full bg-surface min-h-screen pt-16"><div class="flex flex-col w-full">
<div class="px-space-md sm:px-space-lg lg:px-margin-desktop py-space-lg flex flex-col gap-space-lg">
<!-- Top Action & Title Header -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-space-xs">
<span class="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm uppercase tracking-wider">Katalog Terpusat</span>
<span class="text-on-surface-variant font-body-sm text-body-sm">• Sinkronisasi Real-time</span>
</div>
<h1 class="font-headline-xl text-headline-xl text-on-surface tracking-tight">Katalog Produk &amp; Menu</h1>
<p class="font-body-md text-body-md text-on-surface-variant">Kelola item menu, stok bahan baku, margin laba, dan status tayang di terminal kasir.</p>
</div>
<div class="flex flex-wrap items-center gap-space-sm">
<button class="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[18px] text-on-surface-variant">tune</span>
<span>Sesuaikan Kategori</span>
</button>
<button class="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[18px] text-on-surface-variant">ios_share</span>
<span>Import / Export Excel</span>
</button>
<button class="flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary hover:bg-surface-container-highest text-on-primary font-label-md text-label-md shadow-md hover:shadow-lg transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary-container">add_circle</span>
<span>Tambah Menu Baru</span>
</button>
</div>
</div>
<!-- KPI Metric Summary Bento Matrix -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"><div class="p-space-md bg-surface-container-lowest rounded-xl flex flex-col justify-between gap-1 shadow-[0_1px_3px_rgba(28,25,23,0.04)]"><span class="font-label-sm text-label-sm text-on-surface-variant">Total Menu</span><div class="flex items-baseline gap-2"><span class="font-headline-xl text-headline-xl text-on-surface font-bold">38</span><span class="font-body-sm text-body-sm text-secondary">+3 minggu ini</span></div></div><div class="p-space-md bg-surface-container-lowest rounded-xl flex flex-col justify-between gap-1 shadow-[0_1px_3px_rgba(28,25,23,0.04)]"><span class="font-label-sm text-label-sm text-on-surface-variant">Stok Perlu Perhatian</span><div class="flex items-baseline gap-2"><span class="font-headline-xl text-headline-xl text-error font-bold">3</span><span class="font-body-sm text-body-sm text-on-surface-variant">item menipis</span></div></div><div class="p-space-md bg-surface-container-lowest rounded-xl flex flex-col justify-between gap-1 shadow-[0_1px_3px_rgba(28,25,23,0.04)]"><span class="font-label-sm text-label-sm text-on-surface-variant">Terlaris Pekan Ini</span><div class="flex items-baseline gap-2"><span class="font-headline-md text-headline-md text-on-surface font-medium truncate">Aren Latte</span><span class="font-body-sm text-body-sm text-on-surface-variant font-mono">(342 cup)</span></div></div><div class="p-space-md bg-surface-container-lowest rounded-xl flex flex-col justify-between gap-1 shadow-[0_1px_3px_rgba(28,25,23,0.04)]"><span class="font-label-sm text-label-sm text-on-surface-variant">Rata-rata Margin</span><div class="flex items-baseline gap-2"><span class="font-headline-xl text-headline-xl text-on-surface font-bold">62.4%</span><span class="font-body-sm text-body-sm text-on-surface-variant">dari 5 divisi</span></div></div></div>
<!-- Filters, Category Tabs, and Dynamic Search Header -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-[0_1px_4px_rgba(28,25,23,0.04)] flex flex-col gap-space-md"><div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm"><div class="relative flex-1"><span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span><input class="w-full pl-10 pr-space-md py-2 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary-container transition-all" id="katalog-search-input" placeholder="Cari menu, SKU, atau kategori..." type="text"></div><div class="flex items-center gap-2"><div class="relative min-w-[140px]"><select class="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer"><option value="all">Semua Status</option><option value="ready">Tersedia</option><option value="low">Stok Menipis</option><option value="out">Habis</option></select><span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">expand_more</span></div><div class="relative min-w-[150px]"><select class="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer"><option value="popular">Terpopuler</option><option value="price-desc">Harga Tertinggi</option><option value="price-asc">Harga Terendah</option></select><span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">expand_more</span></div></div></div><div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-body-sm"><button class="px-3 py-1 rounded-full font-label-sm text-label-sm bg-primary text-on-primary transition-all" type="button">Semua (38)</button><button class="px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors" type="button">Coffee (16)</button><button class="px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors" type="button">Non-Coffee (8)</button><button class="px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors" type="button">Pastry &amp; Bakery (7)</button><button class="px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors" type="button">Manual Brew (4)</button><button class="px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors" type="button">Add-ons (3)</button></div></div>
<!-- Main High-Fidelity Data Table Container -->
<div class="bg-surface-container-lowest rounded-xl shadow-[0_1px_6px_rgba(28,25,23,0.05)] overflow-hidden flex flex-col">
<!-- Quick Table Actions Toolbar -->
<div class="px-space-md py-space-sm bg-surface-container-low/60 flex items-center justify-between gap-space-sm flex-wrap text-on-surface-variant"><div class="flex items-center gap-space-md"><div class="flex items-center gap-2"><input class="w-4 h-4 rounded text-secondary focus:ring-secondary-container cursor-pointer accent-primary" id="check-all-items" type="checkbox"><label class="font-body-sm text-body-sm text-on-surface cursor-pointer select-none" for="check-all-items">Pilih Semua (6)</label></div><button class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors" type="button"><span class="material-symbols-outlined text-[15px]">edit_note</span><span>Ubah Massal</span></button></div><div class="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant"><span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span><span>Sinkronisasi Otomatis Aktif</span></div></div>
<!-- Table Scroll Wrapper -->
<div class="overflow-x-auto w-full">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider"><th class="py-3 px-space-md w-12 text-center font-normal" scope="col"><span class="sr-only">Seleksi</span></th><th class="py-3 px-space-md font-label-sm text-label-sm tracking-normal text-on-surface-variant font-medium" scope="col">Item</th><th class="py-3 px-space-md font-label-sm text-label-sm tracking-normal text-on-surface-variant font-medium" scope="col">SKU</th><th class="py-3 px-space-md text-right font-label-sm text-label-sm tracking-normal text-on-surface-variant font-medium" scope="col">Harga</th><th class="py-3 px-space-md text-right font-label-sm text-label-sm tracking-normal text-on-surface-variant font-medium" scope="col">Modal</th><th class="py-3 px-space-md text-center font-label-sm text-label-sm tracking-normal text-on-surface-variant font-medium" scope="col">Margin</th><th class="py-3 px-space-md font-label-sm text-label-sm tracking-normal text-on-surface-variant font-medium" scope="col">Status Stok</th><th class="py-3 px-space-md text-center font-label-sm text-label-sm tracking-normal text-on-surface-variant font-medium" scope="col">Tayang Kasir</th><th class="py-3 px-space-md text-center font-label-sm text-label-sm tracking-normal text-on-surface-variant font-medium" scope="col"></th></tr>
</thead>
<tbody class="divide-y divide-transparent font-body-md text-body-md text-on-surface"><tr class="hover:bg-surface-container-low/40 transition-colors"><td class="py-3 px-space-md text-center"><input class="w-4 h-4 rounded text-secondary focus:ring-secondary-container cursor-pointer accent-primary" type="checkbox"></td><td class="py-3 px-space-md"><div class="flex items-center gap-space-sm"><div class="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0"><img class="w-full h-full object-cover" data-alt="Creamy Aren Latte" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc9vf4VseYsHO4GuOGIyycK39DRS9HaXcddznRu4TJwUsjW9l74LyowwGAy6iawQ_ixaS95tD4nw8S6BQp6G1oU16gdkZpqGuUX4PLJOVOjHU_XsShPNWAV7qy5eaSJi5suZRPiDaF0UwFPzYZytBVYz3s_ADSN_WYhRDLasc8fQO72ghHN27RefdVIM0kYnRSTHtfAGWhiLadAzChtsDjbsxj56Zg2UdmCePqBwZl"></div><div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface truncate">Creamy Aren Latte</span><span class="font-body-sm text-body-sm text-on-surface-variant truncate">Espresso Base</span></div></div></td><td class="py-3 px-space-md"><span class="font-mono text-body-sm text-on-surface-variant">CF-001</span></td><td class="py-3 px-space-md text-right font-body-md text-body-md text-on-surface">Rp 32.000</td><td class="py-3 px-space-md text-right font-body-sm text-body-sm text-on-surface-variant">Rp 11.200</td><td class="py-3 px-space-md text-center font-body-sm text-body-sm text-on-surface-variant">65%</td><td class="py-3 px-space-md"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span><span class="font-body-sm text-body-sm text-on-surface">52 porsi</span></div></td><td class="py-3 px-space-md text-center"><button aria-checked="true" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-primary transition-colors duration-200 ease-in-out focus:outline-none" role="switch" type="button"><span class="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 mt-0.5 ml-0.5"></span></button></td><td class="py-3 px-space-md text-center"><div class="flex items-center justify-center gap-1 text-on-surface-variant"><button class="p-1 hover:text-on-surface transition-colors" title="Ubah" type="button"><span class="material-symbols-outlined text-[18px]">edit</span></button><button class="p-1 hover:text-on-surface transition-colors" title="Lainnya" type="button"><span class="material-symbols-outlined text-[18px]">more_horiz</span></button></div></td></tr><tr class="hover:bg-surface-container-low/40 transition-colors"><td class="py-3 px-space-md text-center"><input class="w-4 h-4 rounded text-secondary focus:ring-secondary-container cursor-pointer accent-primary" type="checkbox"></td><td class="py-3 px-space-md"><div class="flex items-center gap-space-sm"><div class="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0"><img class="w-full h-full object-cover" data-alt="Almond Croissant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbrgfqlFifUtlT8DCyQ5N3V9Fx6Y5xBbnAqAIQj11bvKqG6b7-erT7ApqDPeIpuKiBWUZWNB_HYd6ApjqCkwohwTnDQnnvotyB5jGCD1B3XblrFx1qtX0CZu3VU_0ZrTvqd9RfUGvRAiSMYfslR4ubdo-i3itJXgoOG2agg8MFVhVJVOmgSFrh1Ar0LlSDL_qjwKv4mF3Ae6cU3dGsimNxgMjKnD-5dHzXngQ4M7qI"></div><div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface truncate">Almond Croissant</span><span class="font-body-sm text-body-sm text-on-surface-variant truncate">Pastry</span></div></div></td><td class="py-3 px-space-md"><span class="font-mono text-body-sm text-on-surface-variant">FD-012</span></td><td class="py-3 px-space-md text-right font-body-md text-body-md text-on-surface">Rp 28.000</td><td class="py-3 px-space-md text-right font-body-sm text-body-sm text-on-surface-variant">Rp 13.000</td><td class="py-3 px-space-md text-center font-body-sm text-body-sm text-on-surface-variant">53%</td><td class="py-3 px-space-md"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span><span class="font-body-sm text-body-sm text-secondary font-medium">4 porsi (menipis)</span></div></td><td class="py-3 px-space-md text-center"><button aria-checked="true" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-primary transition-colors duration-200 ease-in-out focus:outline-none" role="switch" type="button"><span class="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 mt-0.5 ml-0.5"></span></button></td><td class="py-3 px-space-md text-center"><div class="flex items-center justify-center gap-1 text-on-surface-variant"><button class="p-1 hover:text-on-surface transition-colors" title="Ubah" type="button"><span class="material-symbols-outlined text-[18px]">edit</span></button><button class="p-1 hover:text-on-surface transition-colors" title="Lainnya" type="button"><span class="material-symbols-outlined text-[18px]">more_horiz</span></button></div></td></tr><tr class="hover:bg-surface-container-low/40 transition-colors"><td class="py-3 px-space-md text-center"><input class="w-4 h-4 rounded text-secondary focus:ring-secondary-container cursor-pointer accent-primary" type="checkbox"></td><td class="py-3 px-space-md"><div class="flex items-center gap-space-sm"><div class="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0"><img class="w-full h-full object-cover" data-alt="Matcha Oat Latte" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD17cLm7lSYTKu0oKtq2MOMn33Tc6iCJBpSvdSp0AiuYzvsQY-nY-gfsJxbuxwEisRC1KEaObtb8tgdhOkRlHEkWsi5WGOBNE5My9F7gW5MpcGDiO4_2prZobIm5HG2ewxBDQbaqB7EJQXYyLgbqMQ7FLJAcAAIW6XUCmCdQjCU3lfyoaQ_E73NZC122W9vSTPPekAXC741nhniE8CUOCC9rskpMmVwzem1ICctTx4r"></div><div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface truncate">Matcha Oat Latte</span><span class="font-body-sm text-body-sm text-on-surface-variant truncate">Non-Coffee</span></div></div></td><td class="py-3 px-space-md"><span class="font-mono text-body-sm text-on-surface-variant">NC-004</span></td><td class="py-3 px-space-md text-right font-body-md text-body-md text-on-surface">Rp 36.000</td><td class="py-3 px-space-md text-right font-body-sm text-body-sm text-on-surface-variant">Rp 14.500</td><td class="py-3 px-space-md text-center font-body-sm text-body-sm text-on-surface-variant">60%</td><td class="py-3 px-space-md"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span><span class="font-body-sm text-body-sm text-on-surface">28 porsi</span></div></td><td class="py-3 px-space-md text-center"><button aria-checked="true" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-primary transition-colors duration-200 ease-in-out focus:outline-none" role="switch" type="button"><span class="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 mt-0.5 ml-0.5"></span></button></td><td class="py-3 px-space-md text-center"><div class="flex items-center justify-center gap-1 text-on-surface-variant"><button class="p-1 hover:text-on-surface transition-colors" title="Ubah" type="button"><span class="material-symbols-outlined text-[18px]">edit</span></button><button class="p-1 hover:text-on-surface transition-colors" title="Lainnya" type="button"><span class="material-symbols-outlined text-[18px]">more_horiz</span></button></div></td></tr><tr class="hover:bg-surface-container-low/40 transition-colors opacity-75"><td class="py-3 px-space-md text-center"><input class="w-4 h-4 rounded text-secondary focus:ring-secondary-container cursor-pointer accent-primary" type="checkbox"></td><td class="py-3 px-space-md"><div class="flex items-center gap-space-sm"><div class="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0"><img class="w-full h-full object-cover grayscale" data-alt="V60 Beans Gayo Natural" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH5-73R-JejnY5QClnt_GKCIArwwhFf2rM3DHNDbL9AQmkdHhOly0clSqp5cBlOnq2eHNkugS1UdSDCn1EB1wyL8HS_jQ90QtvtBeeMBmWJWmL1V6E1H031229hS_YVhIogUKQRlGOUTL3u5K_CbRhPvcD_dDQsioD-xmY0qe-rqipXBIPUxrS3XsyeD7dGKrbFJQT_cftRlm89BBNU42wc4anhjimGebUHGOIfeDQ"></div><div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface truncate">V60 Beans Gayo Natural</span><span class="font-body-sm text-body-sm text-on-surface-variant truncate">Manual Brew</span></div></div></td><td class="py-3 px-space-md"><span class="font-mono text-body-sm text-on-surface-variant">MB-008</span></td><td class="py-3 px-space-md text-right font-body-md text-body-md text-on-surface">Rp 42.000</td><td class="py-3 px-space-md text-right font-body-sm text-body-sm text-on-surface-variant">Rp 16.000</td><td class="py-3 px-space-md text-center font-body-sm text-body-sm text-on-surface-variant">62%</td><td class="py-3 px-space-md"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-error"></span><span class="font-body-sm text-body-sm text-error">0 porsi (habis)</span></div></td><td class="py-3 px-space-md text-center"><button aria-checked="false" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-surface-container-high transition-colors duration-200 ease-in-out focus:outline-none" role="switch" type="button"><span class="translate-x-0 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 mt-0.5 ml-0.5"></span></button></td><td class="py-3 px-space-md text-center"><div class="flex items-center justify-center gap-1 text-on-surface-variant"><button class="p-1 hover:text-on-surface transition-colors" title="Ubah" type="button"><span class="material-symbols-outlined text-[18px]">edit</span></button><button class="p-1 hover:text-on-surface transition-colors" title="Lainnya" type="button"><span class="material-symbols-outlined text-[18px]">more_horiz</span></button></div></td></tr><tr class="hover:bg-surface-container-low/40 transition-colors"><td class="py-3 px-space-md text-center"><input class="w-4 h-4 rounded text-secondary focus:ring-secondary-container cursor-pointer accent-primary" type="checkbox"></td><td class="py-3 px-space-md"><div class="flex items-center gap-space-sm"><div class="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0"><img class="w-full h-full object-cover" data-alt="Iced Caramel Macchiato" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5Bf28ajN-57SxQ2yAqEvt7hCQtsIFywyI7XjJXJBWwlJWDcvpwJmfB5NHToyOoUGMLm7gGIuZUDV5azweRSYZ5X_XFWiXUqk6TtgbYOwHtlnFX0x_KAuUHyYwF_kAhKuklvgDaFYmTQYasydwreutWthoPeQzhKl7oirnDXIKkZ08sK8kjkcItsIUOagV4S7sqe7Oatt_y6OvWTX6J5GfwBTcT_sXOR0F0eBQLTZy"></div><div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface truncate">Iced Caramel Macchiato</span><span class="font-body-sm text-body-sm text-on-surface-variant truncate">Espresso Base</span></div></div></td><td class="py-3 px-space-md"><span class="font-mono text-body-sm text-on-surface-variant">CF-003</span></td><td class="py-3 px-space-md text-right font-body-md text-body-md text-on-surface">Rp 38.000</td><td class="py-3 px-space-md text-right font-body-sm text-body-sm text-on-surface-variant">Rp 13.500</td><td class="py-3 px-space-md text-center font-body-sm text-body-sm text-on-surface-variant">64%</td><td class="py-3 px-space-md"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span><span class="font-body-sm text-body-sm text-on-surface">45 porsi</span></div></td><td class="py-3 px-space-md text-center"><button aria-checked="true" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-primary transition-colors duration-200 ease-in-out focus:outline-none" role="switch" type="button"><span class="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 mt-0.5 ml-0.5"></span></button></td><td class="py-3 px-space-md text-center"><div class="flex items-center justify-center gap-1 text-on-surface-variant"><button class="p-1 hover:text-on-surface transition-colors" title="Ubah" type="button"><span class="material-symbols-outlined text-[18px]">edit</span></button><button class="p-1 hover:text-on-surface transition-colors" title="Lainnya" type="button"><span class="material-symbols-outlined text-[18px]">more_horiz</span></button></div></td></tr><tr class="hover:bg-surface-container-low/40 transition-colors"><td class="py-3 px-space-md text-center"><input class="w-4 h-4 rounded text-secondary focus:ring-secondary-container cursor-pointer accent-primary" type="checkbox"></td><td class="py-3 px-space-md"><div class="flex items-center gap-space-sm"><div class="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0"><img class="w-full h-full object-cover" data-alt="Belgian Waffle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW_OsfcWYF4xyON_cKMPAhKMYXx5sjSfyNgDATtSr2e4xS__Eah1rXU48NqV5HOor-F5BrGXKH5q9QWVxwldYnCdRekdr-41HZ4qV6JrnJc5MjmwwncVtAX_JZhYf_P1q2kYEpE_ya21YPbk2873S3u0hbRRWzTIUEObhfxWrSTA8o54PWoCW5v5PJ9EvQvAdPQGEl-Hyb1gf2UePn6_-rv3OZB86MlTa0Ppu223Wn"></div><div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface truncate">Belgian Waffle</span><span class="font-body-sm text-body-sm text-on-surface-variant truncate">Pastry</span></div></div></td><td class="py-3 px-space-md"><span class="font-mono text-body-sm text-on-surface-variant">FD-015</span></td><td class="py-3 px-space-md text-right font-body-md text-body-md text-on-surface">Rp 35.000</td><td class="py-3 px-space-md text-right font-body-sm text-body-sm text-on-surface-variant">Rp 12.000</td><td class="py-3 px-space-md text-center font-body-sm text-body-sm text-on-surface-variant">66%</td><td class="py-3 px-space-md"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span><span class="font-body-sm text-body-sm text-on-surface">12 porsi</span></div></td><td class="py-3 px-space-md text-center"><button aria-checked="true" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-primary transition-colors duration-200 ease-in-out focus:outline-none" role="switch" type="button"><span class="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 mt-0.5 ml-0.5"></span></button></td><td class="py-3 px-space-md text-center"><div class="flex items-center justify-center gap-1 text-on-surface-variant"><button class="p-1 hover:text-on-surface transition-colors" title="Ubah" type="button"><span class="material-symbols-outlined text-[18px]">edit</span></button><button class="p-1 hover:text-on-surface transition-colors" title="Lainnya" type="button"><span class="material-symbols-outlined text-[18px]">more_horiz</span></button></div></td></tr></tbody>
</table>
</div>
<!-- High-Precision Table Footer with Pagination -->
<div class="px-space-md py-space-sm bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
<div class="flex items-center gap-space-sm">
<span>Menampilkan <strong class="text-on-surface">1 - 6</strong> dari <strong class="text-on-surface">38</strong> menu aktif</span>
<span class="text-outline-variant">•</span>
<div class="flex items-center gap-1.5">
<span>Baris per halaman:</span>
<select class="bg-surface-container-low text-on-surface font-label-md text-label-md rounded px-2 py-0.5 focus:outline-none">
<option value="6">6</option>
<option selected="" value="10">10</option>
<option value="25">25</option>
<option value="50">50</option>
</select>
</div>
</div>
<div class="flex items-center gap-1">
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed" disabled="" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button class="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md" type="button">1</button>
<button class="w-8 h-8 rounded-lg hover:bg-surface-container font-label-md text-label-md text-on-surface" type="button">2</button>
<button class="w-8 h-8 rounded-lg hover:bg-surface-container font-label-md text-label-md text-on-surface" type="button">3</button>
<button class="w-8 h-8 rounded-lg hover:bg-surface-container font-label-md text-label-md text-on-surface" type="button">4</button>
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Quick Inventory Alert & Action Bar -->
<div class="px-space-md py-2.5 rounded-lg bg-surface-container-lowest flex items-center justify-between gap-space-md shadow-[0_1px_3px_rgba(28,25,23,0.04)] text-body-sm"><div class="flex items-center gap-2 text-on-surface-variant"><span class="w-2 h-2 rounded-full bg-secondary"></span><span>Susu Segar Pasteurisasi sisa 4 Liter (perlu restock sebelum 14:30)</span></div><div class="flex items-center gap-2"><button class="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm px-2 py-1" type="button">Abaikan</button><button class="text-secondary hover:underline font-label-sm text-label-sm px-2 py-1" type="button">Buat PO</button></div></div>
</div>
<script>
    // Quick search simulation & interactive category buttons
    const searchInput = document.getElementById('katalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const text = row.innerText.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }

    // Interactive category pills toggle
    const categoryButtons = document.querySelectorAll('.overflow-x-auto button');
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryButtons.forEach(b => {
          b.className = 'px-space-md py-1.5 rounded-full font-label-md text-label-md bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-colors';
        });
        btn.className = 'px-space-md py-1.5 rounded-full font-label-md text-label-md bg-primary text-on-primary shadow-sm whitespace-nowrap transition-transform active:scale-95';
      });
    });
  </script>
</div></main><footer class="w-full bg-surface-container-lowest py-space-md mt-auto"><div class="w-full px-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm"><div>© 2025 POS Kafe Specialty Coffee. All rights reserved. Senopati Roastery.</div><div class="flex items-center gap-space-md"><span>Versi Terminal 2.4.0</span><span>Koneksi EDC: Terhubung</span></div></div></footer>

</body></html>

3. Laporan Penjualan
<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1.0" name="viewport"><meta content="web_standard" name="shell-type"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"><link href="https://fonts.googleapis.com" rel="preconnect"><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"surface-container-high":"#f0e6e0","on-surface-variant":"#4d4540","surface-dim":"#e2d8d2","surface-container":"#f6ece6","outline-variant":"#d0c4be","primary":"#000000","on-primary-container":"#888380","surface-container-lowest":"#ffffff","tertiary-fixed":"#ffdbca","on-error-container":"#93000a","on-error":"#ffffff","on-secondary-fixed-variant":"#6e3900","on-tertiary-fixed":"#331200","on-background":"#1f1b17","surface-tint":"#625d5b","surface-container-low":"#fcf2eb","secondary":"#904d00","inverse-surface":"#342f2b","on-secondary-fixed":"#2f1500","on-secondary":"#ffffff","on-tertiary":"#ffffff","on-tertiary-fixed-variant":"#763300","on-secondary-container":"#663500","on-primary-fixed":"#1e1b19","error-container":"#ffdad6","outline":"#7e7570","surface":"#fff8f5","primary-container":"#1e1b19","background":"#fff8f5","secondary-fixed-dim":"#ffb77d","tertiary":"#000000","on-primary-fixed-variant":"#4a4643","secondary-container":"#fe932c","secondary-fixed":"#ffdcc3","surface-bright":"#fff8f5","tertiary-container":"#331200","surface-variant":"#eae1da","on-surface":"#1f1b17","surface-container-highest":"#eae1da","on-tertiary-container":"#cf6721","primary-fixed-dim":"#ccc5c2","error":"#ba1a1a","primary-fixed":"#e9e1dd","tertiary-fixed-dim":"#ffb68e","on-primary":"#ffffff","inverse-primary":"#ccc5c2","inverse-on-surface":"#f9efe8"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"space-xl":"2rem","gutter-desktop":"1.5rem","space-sm":"0.5rem","margin-desktop":"2rem","space-lg":"1.5rem","space-xs":"0.25rem","margin":"1rem","gutter":"1rem","space-md":"1rem"},"fontFamily":{"headline-xl":["Plus Jakarta Sans"],"label-sm":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"],"headline-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"numeric-pos":["Plus Jakarta Sans"],"label-lg":["Plus Jakarta Sans"],"display-lg":["Plus Jakarta Sans"],"body-sm":["Plus Jakarta Sans"],"label-md":["Plus Jakarta Sans"]},"fontSize":{"headline-xl":["28px",{"lineHeight":"36px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-sm":["11px",{"lineHeight":"14px","letterSpacing":"0.04em","fontWeight":"600"}],"body-md":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["22px",{"lineHeight":"30px","letterSpacing":"-0.015em","fontWeight":"600"}],"headline-md":["18px",{"lineHeight":"26px","letterSpacing":"-0.01em","fontWeight":"600"}],"body-lg":["16px",{"lineHeight":"24px","fontWeight":"400"}],"numeric-pos":["24px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-lg":["14px",{"lineHeight":"20px","letterSpacing":"0.01em","fontWeight":"600"}],"display-lg":["36px",{"lineHeight":"44px","letterSpacing":"-0.03em","fontWeight":"700"}],"body-sm":["12px",{"lineHeight":"18px","fontWeight":"400"}],"label-md":["12px",{"lineHeight":"16px","letterSpacing":"0.02em","fontWeight":"600"}]}}}}</script></head><body class="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed"><header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant/20 shadow-xs"><div class="h-16 w-full px-6 flex items-center justify-between gap-4"><div class="flex items-center gap-3 min-w-max"><div class="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-[16px] shadow-xs"><span class="material-symbols-outlined text-[20px]">local_cafe</span></div><div class="flex flex-col"><div class="flex items-center gap-2"><span class="font-headline-md text-[16px] text-on-surface font-bold tracking-tight">POS Kafe</span><span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] font-medium">Cabang Senopati</span></div><div class="flex items-center gap-1.5 text-on-surface-variant"><span class="w-2 h-2 rounded-full bg-[#15803d]"></span><span class="font-body-sm text-[11px]">Kasir 01 • 10:42 WIB Online</span></div></div></div><nav class="hidden xl:flex items-center p-1 bg-surface-container-low rounded-xl gap-1"><a class="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-2" data-path="kasir-pos" href="#"><span class="material-symbols-outlined text-[18px]">point_of_sale</span><span>Kasir POS</span></a><a class="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-2" data-path="katalog-menu" href="#"><span class="material-symbols-outlined text-[18px]">menu_book</span><span>Katalog Menu</span></a><a aria-current="page" class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 bg-primary-container text-on-primary font-label-md font-semibold shadow-xs" data-path="laporan-penjualan" href="#"><span class="material-symbols-outlined text-[18px]">bar_chart</span><span>Laporan Penjualan</span></a><a class="px-3.5 py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-2" data-path="insight-bisnis" href="#"><span class="material-symbols-outlined text-[18px]">auto_awesome</span><span>Insight Bisnis</span></a></nav><div class="flex items-center gap-3 min-w-max"><div class="flex items-center gap-2.5 pl-3 pr-2 py-1 bg-surface-container-low rounded-xl border border-outline-variant/10"><div class="flex flex-col text-right"><span class="font-label-md text-[13px] text-on-surface font-semibold leading-tight">Budi Santoso</span><span class="font-body-sm text-[11px] text-secondary font-medium leading-tight">Shift Pagi</span></div><div class="w-7 h-7 rounded-full bg-secondary-container text-on-primary font-bold text-[11px] flex items-center justify-center shadow-xs">BS</div></div><button class="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-[13px] border border-outline-variant/20 transition-all active:scale-[0.98]" type="button"><span class="material-symbols-outlined text-[16px] text-on-surface-variant">lock</span><span>Kunci Kasir</span></button></div></div></header><main class="w-full bg-surface min-h-screen pt-16"><div class="flex flex-col w-full">
<div class="w-full max-w-[1600px] mx-auto px-space-md lg:px-space-xl py-space-lg flex flex-col gap-space-lg">
<!-- Top Bar: Header & Controls -->
<div class="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md">
<div class="flex flex-col">
<div class="flex items-center gap-space-xs text-secondary mb-1">
<span class="material-symbols-outlined text-[18px]">analytics</span>
<span class="font-label-sm text-label-sm uppercase tracking-wider">Laporan Keuangan &amp; Operasional</span>
</div>
<h1 class="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Laporan Penjualan &amp; Performa Finansial</h1>
<p class="font-body-md text-body-md text-on-surface-variant mt-0.5">Statistik pendapatan, rekap transaksi kasir, dan analisis performa menu harian.</p>
</div>
<!-- Action & Filter Pills -->
<div class="flex flex-wrap items-center gap-space-sm">
<div class="flex items-center p-1 bg-surface-container-high rounded-xl">
<button class="px-space-md py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all" type="button">Hari Ini</button>
<button class="px-space-md py-1.5 rounded-lg font-label-md text-label-md bg-surface-container-lowest text-on-surface shadow-sm transition-all font-semibold" type="button">7 Hari Terakhir</button>
<button class="px-space-md py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all" type="button">30 Hari Terakhir</button>
<button class="px-space-md py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all" type="button">90 Hari Terakhir</button>
<button class="px-space-md py-1.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1" type="button">
<span>Kustom</span>
<span class="material-symbols-outlined text-[16px]">calendar_today</span>
</button>
</div>
<button class="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-sm transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary">file_download</span>
<span>Ekspor PDF / Excel</span>
</button>
</div>
</div>
<!-- 4 Key Executive Performance Metric Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md"><!-- Card 1: Gross Revenue -->
<div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow border border-outline-variant/30">
  <div class="flex items-center justify-between text-on-surface-variant mb-space-sm">
    <span class="font-label-md text-label-md text-on-surface-variant font-medium">Total Pendapatan</span>
    <span class="material-symbols-outlined text-[20px] text-secondary">payments</span>
  </div>
  <div class="flex flex-col gap-1">
    <div class="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">Rp 24.850.000</div>
    <div class="flex items-center gap-1.5 mt-1 font-body-sm text-body-sm text-on-surface-variant">
      <span class="text-[#15803d] font-semibold flex items-center">
        <span class="material-symbols-outlined text-[14px]">arrow_upward</span>14.2%
      </span>
      <span>vs 7 hari lalu</span>
    </div>
  </div>
</div>
<!-- Card 2: Transactions -->
<div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow border border-outline-variant/30">
  <div class="flex items-center justify-between text-on-surface-variant mb-space-sm">
    <span class="font-label-md text-label-md text-on-surface-variant font-medium">Total Transaksi</span>
    <span class="material-symbols-outlined text-[20px] text-secondary">receipt_long</span>
  </div>
  <div class="flex flex-col gap-1">
    <div class="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">682 <span class="font-headline-md text-headline-md font-normal text-on-surface-variant">Struk</span></div>
    <div class="flex items-center gap-1.5 mt-1 font-body-sm text-body-sm text-on-surface-variant">
      <span>Rata-rata 97 transaksi / hari</span>
    </div>
  </div>
</div>
<!-- Card 3: AOV -->
<div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow border border-outline-variant/30">
  <div class="flex items-center justify-between text-on-surface-variant mb-space-sm">
    <span class="font-label-md text-label-md text-on-surface-variant font-medium">Rata-rata Pembelian (AOV)</span>
    <span class="material-symbols-outlined text-[20px] text-secondary">shopping_bag</span>
  </div>
  <div class="flex flex-col gap-1">
    <div class="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">Rp 36.436</div>
    <div class="flex items-center gap-1.5 mt-1 font-body-sm text-body-sm text-on-surface-variant">
      <span class="text-[#15803d] font-semibold flex items-center">
        <span class="material-symbols-outlined text-[14px]">arrow_upward</span>5.1%
      </span>
      <span>peningkatan</span>
    </div>
  </div>
</div>
<!-- Card 4: Top Payment Method -->
<div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow border border-outline-variant/30">
  <div class="flex items-center justify-between text-on-surface-variant mb-space-sm">
    <span class="font-label-md text-label-md text-on-surface-variant font-medium">Metode Utama</span>
    <span class="material-symbols-outlined text-[20px] text-secondary">qr_code_2</span>
  </div>
  <div class="flex flex-col gap-1">
    <div class="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">QRIS <span class="font-headline-md text-headline-md text-secondary font-semibold">62%</span></div>
    <div class="flex items-center justify-between mt-1 text-body-sm text-body-sm text-on-surface-variant">
      <span>Rp 15.4M terproses</span>
      <span class="font-medium text-secondary">Dominan</span>
    </div>
  </div>
</div></div>
<!-- Two Main Content Cards: Left 60% & Right 40% -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
<!-- Card 1 (Left 7-8 cols): Daily Revenue Trend -->
<div class="lg:col-span-7 xl:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between"><div>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md border-b border-outline-variant/20">
    <div>
      <h2 class="font-headline-md text-headline-md text-on-surface font-semibold">Pergerakan Omset Harian</h2>
      <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Total nominal transaksi 7 hari berjalan</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-secondary"></span>
      <span class="font-label-sm text-label-sm text-on-surface-variant">Nominal Penjualan</span>
    </div>
  </div>
  <!-- Simplified Minimal Bar Chart -->
  <div class="pt-8 pb-4">
    <div class="h-56 w-full flex items-end justify-between gap-4 sm:gap-6 px-4">
      <!-- Senin -->
      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
        <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors whitespace-nowrap">2.8M</span>
        <div class="w-full max-w-[42px] bg-surface-container rounded-t-lg relative flex items-end overflow-hidden" style="height: 57%;">
          <div class="w-full bg-secondary-fixed transition-all duration-300 group-hover:bg-secondary" style="height: 100%;"></div>
        </div>
        <span class="font-label-md text-label-md text-on-surface-variant font-medium">Sen</span>
      </div>
      <!-- Selasa -->
      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
        <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors whitespace-nowrap">3.1M</span>
        <div class="w-full max-w-[42px] bg-surface-container rounded-t-lg relative flex items-end overflow-hidden" style="height: 63%;">
          <div class="w-full bg-secondary-fixed transition-all duration-300 group-hover:bg-secondary" style="height: 100%;"></div>
        </div>
        <span class="font-label-md text-label-md text-on-surface-variant font-medium">Sel</span>
      </div>
      <!-- Rabu -->
      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
        <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors whitespace-nowrap">3.4M</span>
        <div class="w-full max-w-[42px] bg-surface-container rounded-t-lg relative flex items-end overflow-hidden" style="height: 69%;">
          <div class="w-full bg-secondary-fixed transition-all duration-300 group-hover:bg-secondary" style="height: 100%;"></div>
        </div>
        <span class="font-label-md text-label-md text-on-surface-variant font-medium">Rab</span>
      </div>
      <!-- Kamis -->
      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
        <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors whitespace-nowrap">3.2M</span>
        <div class="w-full max-w-[42px] bg-surface-container rounded-t-lg relative flex items-end overflow-hidden" style="height: 65%;">
          <div class="w-full bg-secondary-fixed transition-all duration-300 group-hover:bg-secondary" style="height: 100%;"></div>
        </div>
        <span class="font-label-md text-label-md text-on-surface-variant font-medium">Kam</span>
      </div>
      <!-- Jumat -->
      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
        <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors whitespace-nowrap">4.5M</span>
        <div class="w-full max-w-[42px] bg-surface-container rounded-t-lg relative flex items-end overflow-hidden" style="height: 91%;">
          <div class="w-full bg-secondary-fixed transition-all duration-300 group-hover:bg-secondary" style="height: 100%;"></div>
        </div>
        <span class="font-label-md text-label-md text-on-surface-variant font-medium">Jum</span>
      </div>
      <!-- Sabtu (Peak) -->
      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
        <span class="font-label-sm text-label-sm text-secondary font-bold whitespace-nowrap">4.9M</span>
        <div class="w-full max-w-[42px] bg-secondary-fixed rounded-t-lg relative flex items-end overflow-hidden" style="height: 100%;">
          <div class="w-full bg-secondary rounded-t-lg transition-all duration-300" style="height: 100%;"></div>
        </div>
        <span class="font-label-md text-label-md text-secondary font-bold">Sab</span>
      </div>
      <!-- Minggu -->
      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
        <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors whitespace-nowrap">3.9M</span>
        <div class="w-full max-w-[42px] bg-surface-container rounded-t-lg relative flex items-end overflow-hidden" style="height: 79%;">
          <div class="w-full bg-secondary-fixed transition-all duration-300 group-hover:bg-secondary" style="height: 100%;"></div>
        </div>
        <span class="font-label-md text-label-md text-on-surface-variant font-medium">Min</span>
      </div>
    </div>
  </div>
</div>
<!-- Subtle Peak Hour Footnote -->
<div class="mt-space-md pt-space-sm border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between text-body-sm text-on-surface-variant gap-2">
  <div class="flex items-center gap-2">
    <span class="material-symbols-outlined text-[18px] text-secondary">schedule</span>
    <span>Jam tersibuk: <strong>13:00–15:00</strong> &amp; <strong>19:00–21:00</strong></span>
  </div>
  <span class="text-label-sm text-secondary font-medium">Puncak omset pada hari Sabtu</span>
</div></div>
<!-- Card 2 (Right 4-5 cols): Breakdown & Composition -->
<div class="lg:col-span-5 xl:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md"><!-- Payment Composition -->
<div>
  <div class="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
    <div>
      <h2 class="font-headline-md text-headline-md text-on-surface font-semibold">Metode Pembayaran</h2>
      <p class="font-body-sm text-body-sm text-on-surface-variant">Distribusi transaksi</p>
    </div>
    <span class="material-symbols-outlined text-on-surface-variant text-[20px]">account_balance_wallet</span>
  </div>
  <div class="flex flex-col gap-3 mt-space-md">
    <!-- QRIS -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between font-label-md text-label-md">
        <span class="text-on-surface font-medium">QRIS (Dinamis &amp; Statis)</span>
        <span class="font-semibold text-on-surface">62% <span class="text-on-surface-variant font-normal">(Rp 15.4M)</span></span>
      </div>
      <div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
        <div class="bg-secondary h-full rounded-full" style="width: 62%;"></div>
      </div>
    </div>
    <!-- Tunai -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between font-label-md text-label-md">
        <span class="text-on-surface font-medium">Tunai</span>
        <span class="font-semibold text-on-surface">25% <span class="text-on-surface-variant font-normal">(Rp 6.2M)</span></span>
      </div>
      <div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
        <div class="bg-secondary-container h-full rounded-full" style="width: 25%;"></div>
      </div>
    </div>
    <!-- Kartu / EDC -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between font-label-md text-label-md">
        <span class="text-on-surface font-medium">Debit &amp; Kredit EDC</span>
        <span class="font-semibold text-on-surface">13% <span class="text-on-surface-variant font-normal">(Rp 3.2M)</span></span>
      </div>
      <div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
        <div class="bg-outline h-full rounded-full" style="width: 13%;"></div>
      </div>
    </div>
  </div>
</div>

<div class="w-full h-px bg-outline-variant/20 my-2"></div>

<!-- Category Contribution -->
<div>
  <div class="flex items-center justify-between pb-space-sm border-b border-outline-variant/20 mb-space-sm">
    <div>
      <h3 class="font-headline-md text-headline-md text-on-surface font-semibold">Kategori Menu</h3>
      <p class="font-body-sm text-body-sm text-on-surface-variant">Porsi omset</p>
    </div>
    <span class="material-symbols-outlined text-on-surface-variant text-[20px]">pie_chart</span>
  </div>
  <div class="flex items-center gap-space-lg pt-1">
    <!-- Mini Donut SVG -->
    <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
      <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
        <circle class="stroke-surface-container" cx="18" cy="18" fill="none" r="14" stroke-width="3.5"></circle>
        <circle class="stroke-outline" cx="18" cy="18" fill="none" r="14" stroke-dasharray="100" stroke-dashoffset="0" stroke-width="3.5"></circle>
        <circle class="stroke-secondary-container" cx="18" cy="18" fill="none" r="14" stroke-dasharray="32 100" stroke-dashoffset="0" stroke-width="3.5"></circle>
        <circle class="stroke-secondary" cx="18" cy="18" fill="none" r="14" stroke-dasharray="68 100" stroke-dashoffset="0" stroke-width="3.5"></circle>
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="font-label-md text-label-md font-bold text-on-surface">68%</span>
        <span class="text-[9px] uppercase text-on-surface-variant tracking-tight">Kopi</span>
      </div>
    </div>
    <!-- Clean Legend -->
    <div class="flex flex-col gap-2 w-full font-body-sm text-body-sm">
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-2 text-on-surface"><span class="w-2 h-2 rounded-full bg-secondary shrink-0"></span> Specialty Coffee</span>
        <span class="font-semibold text-on-surface">68%</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-2 text-on-surface"><span class="w-2 h-2 rounded-full bg-secondary-container shrink-0"></span> Bakery &amp; Pastry</span>
        <span class="font-semibold text-on-surface">22%</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-2 text-on-surface"><span class="w-2 h-2 rounded-full bg-outline shrink-0"></span> Non-Coffee</span>
        <span class="font-semibold text-on-surface">10%</span>
      </div>
    </div>
  </div>
</div></div>
</div>
<!-- Bottom Section: Best Sellers & Product Performance Leaderboard -->
<div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-2">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[24px]">leaderboard</span>
</div>
<div>
<h2 class="font-headline-md text-headline-md text-on-surface font-bold">Produk Terlaris &amp; Kontribusi Omset</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">5 produk dengan volume perputaran tertinggi pada 7 hari terakhir</p>
</div>
</div>
<button class="flex items-center gap-1.5 font-label-md text-label-md text-secondary hover:underline self-start sm:self-auto" type="button">
<span>Lihat Semua Katalog Menu (42 Item)</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
<!-- Leaderboard Table -->
<div class="w-full overflow-x-auto">
<table class="w-full text-left font-body-md text-body-md border-collapse min-w-[700px]"><thead>
  <tr class="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/30">
    <th class="py-3 px-space-md font-semibold w-16 text-center">#</th>
    <th class="py-3 px-space-md font-semibold">Menu / Produk</th>
    <th class="py-3 px-space-md font-semibold">Kategori</th>
    <th class="py-3 px-space-md font-semibold text-right">Kuantitas</th>
    <th class="py-3 px-space-md font-semibold text-right">Total Omset</th>
    <th class="py-3 px-space-md font-semibold text-right w-24">Porsi</th>
  </tr>
</thead>
<tbody class="divide-y-0">
  <!-- Row 1 -->
  <tr class="border-b border-outline-variant/10 hover:bg-surface-container-low/40 transition-colors group">
    <td class="py-3.5 px-space-md font-semibold text-secondary text-center font-label-md text-label-md">1</td>
    <td class="py-3.5 px-space-md">
      <div class="flex items-center gap-space-sm">
        <img class="w-9 h-9 rounded-lg object-cover bg-surface-container shrink-0" alt="Creamy Aren Latte" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDAVgyEAuGbXwo-TR9IYfI3xsHh1lBNAmobGfzpZ0MdYloqqgBC8XymJB9p3TRRUyksyYjnNuwiDx9RW-oeG0XihZWTl-zGPg1OAXRlgu7chMsXXG3KvsIUBmFiFFEH8QN94n4Vt-XpXIQ2dJ5LRq6m604BEWufI7r8qmdqJy_-nl7VYAv9uYtjqepzw7gfvFCzhm2Lh8pELAPISZWyu78pqYlzINhtwe8TNMEPKSe">
        <div class="flex flex-col">
          <span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-secondary transition-colors">Creamy Aren Latte</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">Signature Espresso Base</span>
        </div>
      </div>
    </td>
    <td class="py-3.5 px-space-md text-body-sm text-on-surface-variant">Specialty Coffee</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface">284 <span class="text-on-surface-variant text-body-sm">cup</span></td>
    <td class="py-3.5 px-space-md text-right font-semibold text-on-surface">Rp 9.088.000</td>
    <td class="py-3.5 px-space-md text-right font-semibold text-secondary font-label-md text-label-md">36.5%</td>
  </tr>
  <!-- Row 2 -->
  <tr class="border-b border-outline-variant/10 hover:bg-surface-container-low/40 transition-colors group">
    <td class="py-3.5 px-space-md font-medium text-on-surface-variant text-center font-label-md text-label-md">2</td>
    <td class="py-3.5 px-space-md">
      <div class="flex items-center gap-space-sm">
        <img class="w-9 h-9 rounded-lg object-cover bg-surface-container shrink-0" alt="Iced Caramel Macchiato" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTVukZhBwjKB0LV8Mb7oONa6vY25Jin41T6xGByWOW5lqox_xU7Q2ylKA9gqg8qmGyvpffafzB7L7I915V38ou83eNgpOClpM2hUD1GwtmimFeXBMwF9l5IhB3373GyckHuhwBt18j7omQLSLGxexkMCSDBNaJu8VrOOoAXf19EuBL5pv8Spi5hOUHZn4lDqUsmnFz-zF0gS6EcJTyB251beKp4O5cUOt9vidjJlWL">
        <div class="flex flex-col">
          <span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-secondary transition-colors">Iced Caramel Macchiato</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">Handcrafted Caramel Drizzle</span>
        </div>
      </div>
    </td>
    <td class="py-3.5 px-space-md text-body-sm text-on-surface-variant">Specialty Coffee</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface">142 <span class="text-on-surface-variant text-body-sm">cup</span></td>
    <td class="py-3.5 px-space-md text-right font-semibold text-on-surface">Rp 5.396.000</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface font-label-md text-label-md">21.7%</td>
  </tr>
  <!-- Row 3 -->
  <tr class="border-b border-outline-variant/10 hover:bg-surface-container-low/40 transition-colors group">
    <td class="py-3.5 px-space-md font-medium text-on-surface-variant text-center font-label-md text-label-md">3</td>
    <td class="py-3.5 px-space-md">
      <div class="flex items-center gap-space-sm">
        <img class="w-9 h-9 rounded-lg object-cover bg-surface-container shrink-0" alt="Almond Croissant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsTfrY0Fl07iNxMVWDdMjbgk0wflYSOrKMH70yh62e0EBCn161zEc06pIXRX2f_u3o1gFOm1FOHVDl6exhfHbqyMFbxubjPdB3oBOIGMHBJAHQ-gusQOhQ4Z6t3kdDRN6IMZrkBd-F6Uhaz8B64IR3LJD_lwYDrIUDZDd0by9MyEkoZk_VAQsvFONyIPa4VLcAf_XF3DnE_WMHn23tq8zBDR080654tmVQLm1NkXWL">
        <div class="flex flex-col">
          <span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-secondary transition-colors">Almond Croissant</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">French Butter &amp; Frangipane</span>
        </div>
      </div>
    </td>
    <td class="py-3.5 px-space-md text-body-sm text-on-surface-variant">Artisan Pastry</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface">110 <span class="text-on-surface-variant text-body-sm">pcs</span></td>
    <td class="py-3.5 px-space-md text-right font-semibold text-on-surface">Rp 3.080.000</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface font-label-md text-label-md">12.4%</td>
  </tr>
  <!-- Row 4 -->
  <tr class="border-b border-outline-variant/10 hover:bg-surface-container-low/40 transition-colors group">
    <td class="py-3.5 px-space-md font-medium text-on-surface-variant text-center font-label-md text-label-md">4</td>
    <td class="py-3.5 px-space-md">
      <div class="flex items-center gap-space-sm">
        <img class="w-9 h-9 rounded-lg object-cover bg-surface-container shrink-0" alt="Matcha Oat Latte" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7MAIKIDiCl6UFqF2nqF6YuM_7s-1_a9ApcbJqEaVodTBnWygzbBw0vThCvhlgKguZo0E8xdKDpO5M3g8gDGh2BoQokHrTV71mAi3t2lYH53EndwdWualsJtjNpJe1EkbTYr1ETOa6IuX9Xzm6mKyVkpi8XXt15wm29NX-xqF25Bxmqwxl0ewD68qhbCQTzrcBlAOQfOSuGu9WoK7t0990TCyHAVaxHvQC2agwLYt-">
        <div class="flex flex-col">
          <span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-secondary transition-colors">Matcha Oat Latte</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">Uji Ceremonial Powder</span>
        </div>
      </div>
    </td>
    <td class="py-3.5 px-space-md text-body-sm text-on-surface-variant">Tea &amp; Non-Coffee</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface">88 <span class="text-on-surface-variant text-body-sm">cup</span></td>
    <td class="py-3.5 px-space-md text-right font-semibold text-on-surface">Rp 3.168.000</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface font-label-md text-label-md">12.7%</td>
  </tr>
  <!-- Row 5 -->
  <tr class="hover:bg-surface-container-low/40 transition-colors group">
    <td class="py-3.5 px-space-md font-medium text-on-surface-variant text-center font-label-md text-label-md">5</td>
    <td class="py-3.5 px-space-md">
      <div class="flex items-center gap-space-sm">
        <img class="w-9 h-9 rounded-lg object-cover bg-surface-container shrink-0" alt="V60 Single Origin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDODm0Ds87rVVPPaWX9vfEh0UZv-CGbCbdiLzapFyn3TFtFzReKVZNO0ocazIij5V62GbFPSSQNGh40Vh7Yf8AjHd56Tysq4yND4Aq6IynzDn8pmmmg1dzyakJovSTKOwb4UkYwoRAgk6ZuUP2go6WnPdr3_HdngzmXDHPIWA0qYcbEvgFuQPgRvqhX2GZHCQwP3GOVyq2y-CkcR5Odq23QqfiaMVKFqr7RNjrBejdj">
        <div class="flex flex-col">
          <span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-secondary transition-colors">V60 Single Origin</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">Ethiopia Yirgacheffe Natural</span>
        </div>
      </div>
    </td>
    <td class="py-3.5 px-space-md text-body-sm text-on-surface-variant">Manual Brew</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface">64 <span class="text-on-surface-variant text-body-sm">cup</span></td>
    <td class="py-3.5 px-space-md text-right font-semibold text-on-surface">Rp 2.688.000</td>
    <td class="py-3.5 px-space-md text-right font-medium text-on-surface font-label-md text-label-md">10.8%</td>
  </tr>
</tbody></table>
</div>
</div>
</div>
</div></main><footer class="w-full bg-surface-container-lowest py-space-md mt-auto"><div class="w-full px-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm"><div>© 2025 POS Kafe Specialty Coffee. All rights reserved. Senopati Roastery.</div><div class="flex items-center gap-space-md"><span>Versi Terminal 2.4.0</span><span>Koneksi EDC: Terhubung</span></div></div></footer>

</body></html>

4. Insight Bisnis
<!DOCTYPE html>

<html lang="id"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"surface-container-high":"#f0e6e0","on-surface-variant":"#4d4540","surface-dim":"#e2d8d2","surface-container":"#f6ece6","outline-variant":"#d0c4be","primary":"#1c1917","on-primary-container":"#888380","surface-container-lowest":"#ffffff","tertiary-fixed":"#ffdbca","on-error-container":"#93000a","on-error":"#ffffff","on-secondary-fixed-variant":"#6e3900","on-tertiary-fixed":"#331200","on-background":"#1f1b17","surface-tint":"#625d5b","surface-container-low":"#fcf2eb","secondary":"#904d00","inverse-surface":"#342f2b","on-secondary-fixed":"#2f1500","on-secondary":"#ffffff","on-tertiary":"#ffffff","on-tertiary-fixed-variant":"#763300","on-secondary-container":"#663500","on-primary-fixed":"#1e1b19","error-container":"#ffdad6","outline":"#7e7570","surface":"#fff8f5","primary-container":"#1c1917","background":"#fff8f5","secondary-fixed-dim":"#ffb77d","tertiary":"#1c1917","on-primary-fixed-variant":"#4a4643","secondary-container":"#fe932c","secondary-fixed":"#ffdcc3","surface-bright":"#fff8f5","tertiary-container":"#331200","surface-variant":"#eae1da","on-surface":"#1f1b17","surface-container-highest":"#eae1da","on-tertiary-container":"#cf6721","primary-fixed-dim":"#ccc5c2","error":"#ba1a1a","primary-fixed":"#e9e1dd","tertiary-fixed-dim":"#ffb68e","on-primary":"#ffffff","inverse-primary":"#ccc5c2","inverse-on-surface":"#f9efe8"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","2xl":"1rem","full":"9999px"},"spacing":{"space-xl":"2rem","gutter-desktop":"1.5rem","space-sm":"0.5rem","margin-desktop":"2rem","space-lg":"1.5rem","space-xs":"0.25rem","margin":"1rem","gutter":"1rem","space-md":"1rem"},"fontFamily":{"headline-xl":["Plus Jakarta Sans"],"label-sm":["Plus Jakarta Sans"],"body-md":["Plus Jakarta Sans"],"headline-lg":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"numeric-pos":["Plus Jakarta Sans"],"label-lg":["Plus Jakarta Sans"],"display-lg":["Plus Jakarta Sans"],"body-sm":["Plus Jakarta Sans"],"label-md":["Plus Jakarta Sans"]},"fontSize":{"headline-xl":["28px",{"lineHeight":"36px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-sm":["11px",{"lineHeight":"14px","letterSpacing":"0.04em","fontWeight":"600"}],"body-md":["14px",{"lineHeight":"20px","fontWeight":"400"}],"headline-lg":["22px",{"lineHeight":"30px","letterSpacing":"-0.015em","fontWeight":"600"}],"headline-md":["18px",{"lineHeight":"26px","letterSpacing":"-0.01em","fontWeight":"600"}],"body-lg":["16px",{"lineHeight":"24px","fontWeight":"400"}],"numeric-pos":["24px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"700"}],"label-lg":["14px",{"lineHeight":"20px","letterSpacing":"0.01em","fontWeight":"600"}],"display-lg":["36px",{"lineHeight":"44px","letterSpacing":"-0.03em","fontWeight":"700"}],"body-sm":["12px",{"lineHeight":"18px","fontWeight":"400"}],"label-md":["12px",{"lineHeight":"16px","letterSpacing":"0.02em","fontWeight":"600"}]}}}}</script></head><body class="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed overflow-x-hidden">
<!-- NAVBAR PRESISI & KONSISTEN (h-16 / 64px, px-6) -->
<header class="fixed top-0 left-0 right-0 w-full z-50 h-16 bg-surface-container-lowest border-b border-surface-container-high/60 shadow-[0_1px_4px_rgba(28,25,23,0.03)]"><div class="h-full px-6 flex items-center justify-between gap-4"><div class="flex items-center gap-3 min-w-max"><div class="w-9 h-9 rounded-xl bg-[#1c1917] text-white flex items-center justify-center shadow-sm"><span class="material-symbols-outlined text-[20px] text-secondary-fixed">local_cafe</span></div><div class="flex flex-col"><div class="flex items-center gap-2"><span class="font-bold text-[16px] text-on-surface tracking-tight">POS Kafe</span><span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-medium">Cabang Senopati</span></div><div class="flex items-center gap-1.5 text-on-surface-variant"><span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="text-[11px] font-medium text-emerald-700">10:42 WIB • Online</span></div></div></div><nav class="hidden md:flex items-center h-10 p-1 bg-surface-container-low rounded-xl gap-1"><a class="px-3.5 h-8 rounded-lg text-[13px] font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-1.5" data-path="kasir-pos" href="#"><span class="material-symbols-outlined text-[17px]">point_of_sale</span><span>Kasir POS</span></a><a class="px-3.5 h-8 rounded-lg text-[13px] font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-1.5" data-path="katalog-menu" href="#"><span class="material-symbols-outlined text-[17px]">menu_book</span><span>Katalog Menu</span></a><a class="px-3.5 h-8 rounded-lg text-[13px] font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all flex items-center gap-1.5" data-path="laporan-penjualan" href="#"><span class="material-symbols-outlined text-[17px]">bar_chart</span><span>Laporan Penjualan</span></a><a aria-current="page" class="px-3.5 h-8 rounded-lg transition-all flex items-center gap-1.5 bg-[#1c1917] text-white font-medium text-[13px] shadow-sm" data-path="insight-bisnis" href="#"><span class="material-symbols-outlined text-[17px] text-secondary-fixed">auto_awesome</span><span>Insight Bisnis</span></a></nav><div class="flex items-center gap-3 min-w-max"><div class="flex items-center gap-2.5 pl-3 py-1 bg-surface-container-low rounded-xl pr-1.5"><div class="flex flex-col text-right"><span class="text-[12px] font-semibold text-on-surface leading-tight">Budi Santoso</span><span class="text-[10px] text-secondary font-medium">Shift Pagi (Aktif)</span></div><div class="w-7 h-7 rounded-full bg-secondary-fixed text-[#1c1917] font-bold text-xs flex items-center justify-center border border-white/80">BS</div></div><button class="h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-all active:scale-[0.98] flex items-center gap-1.5 border border-surface-container-high" type="button"><span class="material-symbols-outlined text-[16px] text-on-surface-variant">lock</span><span class="hidden sm:inline">Kunci Kasir</span></button></div></div></header>
<!-- MAIN CHATBOT WORKSPACE (2-COLUMN LAYOUT) -->
<main class="w-full pt-16 bg-surface min-h-[calc(100vh)] flex flex-col">
<div class="flex-1 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
<!-- KOLOM KIRI (SIDEBAR AI QUICK PROMPTS & HISTORY) -->
<aside class="w-full md:w-[320px] lg:w-[340px] flex-shrink-0 bg-surface-container-lowest border-r border-surface-container-high/60 flex flex-col h-full overflow-hidden">
<!-- Sidebar Header -->
<div class="p-4 border-b border-surface-container-high/50 flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-7 h-7 rounded-lg bg-secondary-fixed/50 text-secondary flex items-center justify-center">
<span class="material-symbols-outlined text-[17px]">smart_toy</span>
</div>
<div class="flex flex-col">
<span class="font-bold text-[14px] text-on-surface">Asisten AI Kafe</span>
<span class="text-[10px] text-on-surface-variant">Senopati Roastery Intel</span>
</div>
</div>
<span class="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary text-[10px] font-semibold border border-secondary-fixed/50">GPT-4o &amp; Supabase</span>
</div>
<!-- Button New Chat -->
<button class="w-full py-2.5 px-3 rounded-xl bg-[#1c1917] hover:bg-neutral-800 text-white text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
<span class="material-symbols-outlined text-[18px] text-secondary-fixed">add</span>
<span>Percakapan Baru</span>
</button>
</div>
<!-- Scrollable Prompt Categories & History -->
<div class="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
<!-- Quick Prompts Section -->
<div class="flex flex-col gap-2.5">
<div class="flex items-center justify-between">
<span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Rekomendasi Cepat</span>
<span class="text-[10px] text-secondary font-medium">Klik untuk tanya</span>
</div>
<button class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-transparent transition-all group flex flex-col gap-1" onclick="fillChatInput('Menu apa dengan margin laba terendah minggu ini?')">
<div class="flex items-center gap-1.5 text-[12px] font-bold text-on-surface group-hover:text-secondary">
<span>📊 Evaluasi Menu &amp; Margin</span>
</div>
<p class="text-[11px] text-on-surface-variant line-clamp-1 leading-snug">"Menu apa dengan margin laba terendah minggu ini?"</p>
</button>
<button class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-transparent transition-all group flex flex-col gap-1" onclick="fillChatInput('Bahan baku apa yang perlu direstock sebelum akhir pekan?')">
<div class="flex items-center gap-1.5 text-[12px] font-bold text-on-surface group-hover:text-secondary">
<span>📦 Prediksi Stok Habis</span>
</div>
<p class="text-[11px] text-on-surface-variant line-clamp-1 leading-snug">"Bahan baku apa yang perlu direstock sebelum akhir pekan?"</p>
</button>
<button class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-transparent transition-all group flex flex-col gap-1" onclick="fillChatInput('Kapan jam terpadat esok hari dan rekomendasi shift barista?')">
<div class="flex items-center gap-1.5 text-[12px] font-bold text-on-surface group-hover:text-secondary">
<span>👥 Jam Sibuk Barista</span>
</div>
<p class="text-[11px] text-on-surface-variant line-clamp-1 leading-snug">"Kapan jam terpadat esok hari dan rekomendasi shift barista?"</p>
</button>
<button class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-transparent transition-all group flex flex-col gap-1" onclick="fillChatInput('Buatkan paket bundling pastry + kopi untuk jam 14:00 - 17:00')">
<div class="flex items-center gap-1.5 text-[12px] font-bold text-on-surface group-hover:text-secondary">
<span>💡 Ide Bundling Promo</span>
</div>
<p class="text-[11px] text-on-surface-variant line-clamp-1 leading-snug">"Buatkan paket bundling pastry + kopi untuk jam 14:00 - 17:00"</p>
</button>
</div>
<!-- History Sessions Section -->
<div class="flex flex-col gap-2 pt-2 border-t border-surface-container-high/60">
<span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Sesi Analisis Sebelumnya</span>
<div class="flex flex-col gap-1">
<button class="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-container-low flex items-center justify-between text-on-surface-variant hover:text-on-surface transition-all text-[12px]">
<span class="truncate pr-2">Lonjakan Matcha Oat (Kemarin)</span>
<span class="material-symbols-outlined text-[15px] opacity-60">chevron_right</span>
</button>
<button class="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-container-low flex items-center justify-between text-on-surface-variant hover:text-on-surface transition-all text-[12px]">
<span class="truncate pr-2">Restock Susu &amp; Flores Bajawa</span>
<span class="material-symbols-outlined text-[15px] opacity-60">chevron_right</span>
</button>
<button class="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-container-low flex items-center justify-between text-on-surface-variant hover:text-on-surface transition-all text-[12px]">
<span class="truncate pr-2">Evaluasi Diskon Member Silver</span>
<span class="material-symbols-outlined text-[15px] opacity-60">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Sidebar Status Footer -->
<div class="p-3 bg-surface-container-low border-t border-surface-container-high/50 flex items-center justify-between text-[11px] text-on-surface-variant">
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
<span>Supabase Edge Sync</span>
</div>
<span class="font-medium text-on-surface">v2.4 Live</span>
</div>
</aside>
<!-- KOLOM UTAMA / KANAN (CHAT INTERFACE WORKSPACE) -->
<section class="flex-1 flex flex-col h-full bg-surface relative overflow-hidden">
<!-- Chat Header -->
<div class="h-14 px-6 bg-surface-container-lowest/80 backdrop-blur-sm border-b border-surface-container-high/60 flex items-center justify-between flex-shrink-0 z-10">
<div class="flex items-center gap-3">
<div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
<div class="flex items-center gap-2">
<span class="font-semibold text-[13px] text-on-surface">Status Real-time:</span>
<span class="text-[12px] text-on-surface-variant">Terkoneksi ke database POS Senopati <strong class="text-on-surface">(1.420 transaksi dianalisis hari ini)</strong></span>
</div>
</div>
<div class="flex items-center gap-2">
<span class="text-[11px] px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface-variant font-medium hidden sm:inline">Latensi: 140ms</span>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" title="Export Chat">
<span class="material-symbols-outlined text-[18px]">download</span>
</button>
</div>
</div>
<!-- Chat Timeline Messages (Scrollable) -->
<div class="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6" id="chat-messages-container">
<!-- Bubble 1 (User) -->
<div class="flex justify-end gap-3 max-w-3xl ml-auto">
<div class="flex flex-col items-end gap-1">
<div class="px-4 py-3 rounded-2xl rounded-tr-xs bg-[#1c1917] text-white text-[13px] leading-relaxed shadow-sm">
              Halo, tolong berikan ringkasan performa penjualan hari ini dan apa tindakan mendesak yang perlu diambil?
            </div>
<span class="text-[10px] text-on-surface-variant pr-1">10:38 WIB • Anda</span>
</div>
<div class="w-8 h-8 rounded-full bg-[#1c1917] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            BS
          </div>
</div>
<!-- Bubble 2 (AI Assistant) -->
<div class="flex items-start gap-3 max-w-3xl mr-auto">
<div class="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0 mt-0.5 border border-secondary/20 shadow-xs">
<span class="material-symbols-outlined text-[18px]">smart_toy</span>
</div>
<div class="flex flex-col items-start gap-3 w-full">
<div class="w-full p-5 rounded-2xl rounded-tl-xs bg-surface-container-lowest border border-surface-container-high/60 shadow-sm flex flex-col gap-4">
<!-- Greeting & KPI Strip -->
<div class="flex flex-col gap-2">
<div class="flex items-center justify-between">
<span class="font-bold text-[13px] text-on-surface flex items-center gap-1.5">
<span>Ringkasan Performa &amp; Rekomendasi Cepat</span>
</span>
<span class="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">Data Terupdate 10:40 WIB</span>
</div>
<p class="text-[13px] text-on-surface-variant leading-relaxed">
                  Selamat pagi! Operasional Kafe Senopati berjalan sangat dinamis hari ini. Berikut metriks kunci hingga pukul 10:40 WIB:
                </p>
<!-- KPI Tiles in Chat -->
<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
<div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col">
<span class="text-[11px] text-on-surface-variant">Omset Hari Ini</span>
<span class="text-[16px] font-bold text-on-surface">Rp 6.420.000</span>
<span class="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
<span class="material-symbols-outlined text-[12px]">trending_up</span> +14% vs kemarin
                    </span>
</div>
<div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col">
<span class="text-[11px] text-on-surface-variant">Volume Terjual</span>
<span class="text-[16px] font-bold text-on-surface">184 Cups</span>
<span class="text-[10px] font-semibold text-secondary flex items-center gap-0.5 mt-0.5">
                      Puncak: 08:30 - 09:30
                    </span>
</div>
<div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col col-span-2 sm:col-span-1">
<span class="text-[11px] text-on-surface-variant">Rata-rata Basket</span>
<span class="text-[16px] font-bold text-on-surface">Rp 34.800</span>
<span class="text-[10px] text-on-surface-variant mt-0.5">Target: Rp 35.000</span>
</div>
</div>
</div>
<!-- Kartu Alert Visual: Stok Menipis -->
<div class="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
<div class="flex items-start gap-2.5">
<span class="material-symbols-outlined text-amber-600 text-[20px] flex-shrink-0 mt-0.5">warning</span>
<div class="flex flex-col">
<span class="text-[12px] font-bold text-amber-950">⚠️ Stok Kritis: Susu Segar Pasteurisasi Tersisa 4 Liter</span>
<p class="text-[11px] text-amber-800 leading-snug mt-0.5">Estimasi habis pukul 14:30 WIB saat peak hour barista. Segera re-order ke supplier lokal!</p>
</div>
</div>
<button class="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-[11px] flex-shrink-0 flex items-center gap-1 shadow-xs transition-all active:scale-95" onclick="alert('Permintaan Purchase Order 40L Susu dikirim ke Supplier Greenfields!')">
<span class="material-symbols-outlined text-[14px]">local_shipping</span>
<span>Buat PO Supplier</span>
</button>
</div>
<!-- Rekomendasi Otomasi Promosi: Bundling Pastry -->
<div class="p-3.5 rounded-xl bg-secondary-fixed/30 border border-secondary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
<div class="flex items-start gap-2.5">
<span class="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5">local_offer</span>
<div class="flex flex-col">
<span class="text-[12px] font-bold text-on-surface">💡 Bundling Promo: Almond Croissant (Sisa 14 pcs)</span>
<p class="text-[11px] text-on-surface-variant leading-snug mt-0.5">Pasangkan dengan Iced Caramel Macchiato diskon 15% untuk mendongkrak omset sore dan kurangi sisa bahan.</p>
</div>
</div>
<button class="px-3 py-1.5 rounded-lg bg-[#1c1917] hover:bg-neutral-800 text-white font-semibold text-[11px] flex-shrink-0 flex items-center gap-1 shadow-xs transition-all active:scale-95" onclick="alert('Promo Bundling Almond Croissant + Caramel Macchiato aktif di POS Kasir!')">
<span class="material-symbols-outlined text-[14px] text-secondary-fixed">bolt</span>
<span>Terapkan Promo Kasir</span>
</button>
</div>
<!-- Mini Forecast Chart Card -->
<div class="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/50 flex flex-col gap-2">
<div class="flex items-center justify-between">
<span class="text-[11px] font-bold text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-[15px] text-secondary">trending_up</span>
<span>Proyeksi Lonjakan Pesanan Sore (15:00 - 18:00 WIB)</span>
</span>
<span class="text-[10px] font-semibold text-secondary">+65 Cup Diproyeksikan</span>
</div>
<div class="h-16 w-full flex items-end gap-1.5 pt-2">
<div class="flex-1 flex flex-col items-center gap-1">
<span class="text-[9px] text-on-surface-variant">12:00</span>
<div class="w-full bg-surface-container-highest rounded-t h-6"></div>
</div>
<div class="flex-1 flex flex-col items-center gap-1">
<span class="text-[9px] text-on-surface-variant">13:00</span>
<div class="w-full bg-surface-container-highest rounded-t h-7"></div>
</div>
<div class="flex-1 flex flex-col items-center gap-1">
<span class="text-[9px] text-on-surface-variant">14:00</span>
<div class="w-full bg-surface-container-highest rounded-t h-9"></div>
</div>
<div class="flex-1 flex flex-col items-center gap-1">
<span class="text-[9px] text-secondary font-bold">15:00</span>
<div class="w-full bg-secondary-container rounded-t h-12 relative group">
<span class="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-secondary">Peak</span>
</div>
</div>
<div class="flex-1 flex flex-col items-center gap-1">
<span class="text-[9px] text-secondary font-bold">16:00</span>
<div class="w-full bg-secondary rounded-t h-14"></div>
</div>
<div class="flex-1 flex flex-col items-center gap-1">
<span class="text-[9px] text-secondary font-bold">17:00</span>
<div class="w-full bg-secondary-container rounded-t h-11"></div>
</div>
<div class="flex-1 flex flex-col items-center gap-1">
<span class="text-[9px] text-on-surface-variant">18:00</span>
<div class="w-full bg-surface-container-highest rounded-t h-8"></div>
</div>
</div>
</div>
</div>
<span class="text-[10px] text-on-surface-variant pl-1">10:39 WIB • AI Kafe Specialty</span>
</div>
</div>
<!-- Bubble 3 (User) -->
<div class="flex justify-end gap-3 max-w-3xl ml-auto">
<div class="flex flex-col items-end gap-1">
<div class="px-4 py-3 rounded-2xl rounded-tr-xs bg-[#1c1917] text-white text-[13px] leading-relaxed shadow-sm">
              Berapa proyeksi penjualan untuk akhir pekan ini?
            </div>
<span class="text-[10px] text-on-surface-variant pr-1">10:41 WIB • Anda</span>
</div>
<div class="w-8 h-8 rounded-full bg-[#1c1917] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            BS
          </div>
</div>
<!-- Bubble 4 (AI Assistant - Streaming / Structured) -->
<div class="flex items-start gap-3 max-w-3xl mr-auto">
<div class="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0 mt-0.5 border border-secondary/20 shadow-xs">
<span class="material-symbols-outlined text-[18px]">smart_toy</span>
</div>
<div class="flex flex-col items-start gap-3 w-full">
<div class="w-full p-5 rounded-2xl rounded-tl-xs bg-surface-container-lowest border border-surface-container-high/60 shadow-sm flex flex-col gap-3">
<div class="flex items-center gap-2 text-secondary">
<span class="material-symbols-outlined text-[18px]">event_upcoming</span>
<span class="font-bold text-[13px] text-on-surface">Proyeksi Weekend &amp; Event Senopati Jazz Festival</span>
</div>
<p class="text-[13px] text-on-surface-variant leading-relaxed">
                Berdasarkan data historis 90 hari dan integrasi kalender lokal <strong>Senopati Jazz Festival</strong> Sabtu ini:
              </p>
<div class="p-3 rounded-xl bg-surface-container-low border-l-4 border-secondary flex flex-col gap-1.5">
<div class="flex items-center justify-between">
<span class="text-[12px] font-bold text-on-surface">Estimasi Revenue Sabtu &amp; Minggu:</span>
<span class="text-[14px] font-bold text-secondary">Rp 21.800.000 <span class="text-[11px] font-normal text-emerald-600">(+28%)</span></span>
</div>
<p class="text-[12px] text-on-surface-variant leading-normal">
                  Kapasitas barista saat ini berpotensi mengalami bottleneck pada pukul 15:00 - 20:00 dengan antrean di atas 9 menit.
                </p>
<div class="mt-1 pt-2 border-t border-surface-container-high flex items-center justify-between text-[11px]">
<span class="font-semibold text-on-surface">📌 Tindakan Rekomendasi:</span>
<span class="text-secondary font-medium">Siapkan 2 barista tambahan pada shift 14:00 - 22:00</span>
</div>
</div>
<div class="flex items-center gap-2 pt-1 text-[11px] text-on-surface-variant">
<span class="flex h-2 w-2 relative">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
</span>
<span>Model AI terus memantau pemesanan masuk secara adaptif</span>
</div>
</div>
<span class="text-[10px] text-on-surface-variant pl-1">10:41 WIB • AI Kafe Specialty</span>
</div>
</div>
</div>
<!-- DOCKED CHAT INPUT BAR (BOTTOM) -->
<div class="p-4 md:px-8 md:pb-6 bg-gradient-to-t from-surface via-surface to-transparent flex-shrink-0 z-20">
<div class="max-w-3xl mx-auto flex flex-col gap-2">
<!-- Quick Suggestion Mini Chips -->
<div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
<span class="text-on-surface-variant text-[10px] font-medium flex-shrink-0 flex items-center gap-0.5">
<span class="material-symbols-outlined text-[13px]">bolt</span> Saran:
            </span>
<button class="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container-high/80 text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-all" onclick="fillChatInput('Cek profit margin Iced Aren Latte vs Oat Latte')">
              Margin Aren vs Oat
            </button>
<button class="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container-high/80 text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-all" onclick="fillChatInput('Berapa liter susu yang harus dipesan untuk 3 hari ke depan?')">
              Kebutuhan Susu 3 Hari
            </button>
<button class="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container-high/80 text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-all" onclick="fillChatInput('Rekomendasikan diskon happy hour sore ini')">
              Happy Hour Sore
            </button>
</div>
<!-- Floating Input Container -->
<div class="w-full bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 shadow-[0_4px_20px_rgba(28,25,23,0.06)] p-2 flex items-center gap-2">
<button class="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all flex-shrink-0" title="Lampirkan data transaksi POS">
<span class="material-symbols-outlined text-[20px]">attach_file</span>
</button>
<input class="w-full bg-transparent border-0 focus:ring-0 text-[13px] text-on-surface placeholder:text-on-surface-variant/60 py-2.5 px-1 focus:outline-none" id="main-chat-input" placeholder="Tanyakan apa saja tentang penjualan, stok, atau strategi kafe..." type="text"/>
<div class="flex items-center gap-1.5 flex-shrink-0">
<button class="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all" title="Input Suara">
<span class="material-symbols-outlined text-[19px]">mic</span>
</button>
<button class="h-10 px-4 rounded-xl bg-[#1c1917] hover:bg-neutral-800 text-white font-medium text-[13px] flex items-center gap-1.5 transition-all shadow-sm active:scale-95" id="btn-send-chat" type="button">
<span>Kirim</span>
<span class="material-symbols-outlined text-[16px] text-secondary-fixed">send</span>
</button>
</div>
</div>
<div class="text-center text-[10px] text-on-surface-variant">
            AI Kafe terlatih dengan data transaksi Senopati Roastery. Verifikasi aksi kritis stok sebelum finalisasi PO.
          </div>
</div>
</div>
</section>
</div>
</main>
<script>
  function fillChatInput(text) {
    const input = document.getElementById('main-chat-input');
    if (input) {
      input.value = text;
      input.focus();
    }
  }

  (function initChatActions() {
    const input = document.getElementById('main-chat-input');
    const sendBtn = document.getElementById('btn-send-chat');
    const container = document.getElementById('chat-messages-container');

    if (!input || !sendBtn || !container) return;

    function handleSend() {
      const q = input.value.trim();
      if (!q) return;

      // Add user bubble
      const now = new Date();
      const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ' WIB';
      
      const userBubble = document.createElement('div');
      userBubble.className = 'flex justify-end gap-3 max-w-3xl ml-auto';
      userBubble.innerHTML = `
        <div class="flex flex-col items-end gap-1">
          <div class="px-4 py-3 rounded-2xl rounded-tr-xs bg-[#1c1917] text-white text-[13px] leading-relaxed shadow-sm">
            ${escapeHtml(q)}
          </div>
          <span class="text-[10px] text-on-surface-variant pr-1">${timeStr} • Anda</span>
        </div>
        <div class="w-8 h-8 rounded-full bg-[#1c1917] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          BS
        </div>
      `;
      container.appendChild(userBubble);
      input.value = '';
      container.scrollTop = container.scrollHeight;

      // Temporary AI typing indicator
      const typingBubble = document.createElement('div');
      typingBubble.className = 'flex items-start gap-3 max-w-3xl mr-auto';
      typingBubble.id = 'ai-typing-temp';
      typingBubble.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0 mt-0.5 border border-secondary/20 shadow-xs">
          <span class="material-symbols-outlined text-[18px]">smart_toy</span>
        </div>
        <div class="p-3.5 rounded-2xl rounded-tl-xs bg-surface-container-lowest border border-surface-container-high/60 shadow-sm flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-secondary animate-bounce"></span>
          <span class="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]"></span>
          <span class="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.4s]"></span>
          <span class="text-[11px] text-on-surface-variant ml-2 font-medium">Sedang menghitung data POS Senopati...</span>
        </div>
      `;
      container.appendChild(typingBubble);
      container.scrollTop = container.scrollHeight;

      setTimeout(() => {
        const temp = document.getElementById('ai-typing-temp');
        if (temp) temp.remove();

        let replyHtml = '';
        const qLower = q.toLowerCase();

        if (qLower.includes('margin') || qLower.includes('laba')) {
          replyHtml = `
            <div class="font-bold text-[13px] text-on-surface mb-1">Analisis Margin Menu Terendah:</div>
            <p class="text-[13px] text-on-surface-variant leading-relaxed mb-2">
              Menu dengan margin laba bersih terendah saat ini adalah <strong>Matcha Oat Latte Ice (margin 38%)</strong> akibat kenaikan harga bahan baku Oat Milk impor.
            </p>
            <div class="p-2.5 rounded-lg bg-surface-container-low text-[12px] border border-surface-container-high">
              <strong>Solusi AI:</strong> Ganti ke Oat Milk lokal barista edition (hemat Rp 3.200/serving) atau naikkan harga jual dari Rp 38.000 menjadi Rp 42.000 untuk mempertahankan margin 52%.
            </div>
          `;
        } else if (qLower.includes('stok') || qLower.includes('restock')) {
          replyHtml = `
            <div class="font-bold text-[13px] text-on-surface mb-1">Rekomendasi Restock Sebelum Akhir Pekan:</div>
            <p class="text-[13px] text-on-surface-variant leading-relaxed mb-2">
              Tiga bahan baku prioritas tinggi untuk pemesanan supplier hari ini:
            </p>
            <ul class="text-[12px] text-on-surface-variant space-y-1 list-disc list-inside">
              <li><strong>Fresh Milk Pasteurisasi:</strong> Butuh +60 Liter (stok aman saat weekend)</li>
              <li><strong>Biji Kopi House Blend (70:30):</strong> Sisa 3.5 Kg, order minimal +15 Kg</li>
              <li><strong>Sirup Gula Aren Organik:</strong> Sisa 2 Jerigen (estimasi habis Sabtu siang)</li>
            </ul>
          `;
        } else {
          replyHtml = `
            <div class="font-bold text-[13px] text-on-surface mb-1">Rekomendasi Operasional:</div>
            <p class="text-[13px] text-on-surface-variant leading-relaxed">
              Berdasarkan pola transaksi 14 hari terakhir di Cabang Senopati, rasio konversi tertinggi terjadi pada kombinasi kopi filter manual brew dengan pastry di pagi hari, serta cold brew aren saat sore hari.
            </p>
          `;
        }

        const aiBubble = document.createElement('div');
        aiBubble.className = 'flex items-start gap-3 max-w-3xl mr-auto';
        aiBubble.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0 mt-0.5 border border-secondary/20 shadow-xs">
            <span class="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div class="flex flex-col items-start gap-2 w-full">
            <div class="w-full p-4 rounded-2xl rounded-tl-xs bg-surface-container-lowest border border-surface-container-high/60 shadow-sm flex flex-col">
              ${replyHtml}
            </div>
            <span class="text-[10px] text-on-surface-variant pl-1">${timeStr} • AI Kafe Specialty</span>
          </div>
        `;
        container.appendChild(aiBubble);
        container.scrollTop = container.scrollHeight;
      }, 900);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleSend();
    });

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  })();
</script>
</body></html>