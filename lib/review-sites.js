// lib/review-sites.js — which Google review belongs to which live site of the portfolio (lib/data.js).
// Key = the reviewer's name exactly as in lib/reviews.js, value = the site's url exactly as in lib/data.js.
// Only pairs we are sure about (same name, or the review is signed with the name). A reviewer with no
// site in the portfolio is simply left out: the review then shows in the plain list under the spotlight.
// New review from a client whose site is in the portfolio → add one line here.
export const REVIEW_SITE = {
  "Vasilis Posnakidis": "https://selfiehair.gr", // Selfie Hair Inspirations
  "Ilias Tsallis": "https://iliastsallis.gr", // Ηλίας Τσάλλης
  "Κωνσταντίνα Μπογιατζή": "https://bogiatzi-psychologist.gr", // Κωνσταντίνα Μπογιατζή
  "Eleni Morogianni": "https://emorogianni.gr", // Ελένη Μωρόγιαννη
  "Eugenia Panagiotidou": "https://vavavoomacting.com", // Va Va Voom Acting Studio
  "maria malapetsa": "https://mariamalapetsa-mentalhealth.gr", // Μαρία Μαλαπέτσα
  "Basilis Kolymenos": "https://vasiliskolymenos.gr", // Βασίλειος Κολυμένος
  "Χρύσα Φερίδου": "https://chrysaferidou.gr", // Χρύσα Φερίδου
  "Elina Gk.": "https://elinagkountara-psychologist.gr", // Ελίνα Γκουντάρα
  "Fotis Vogiatzis": "https://vogiatzis-dent.gr", // Νίκος & Φώτης Βογιατζής
  "Παναγιωτης Μπανος": "https://banos-panagiotis-psychologist.gr", // Παναγιώτης Μπάνος
  "Ανθη Θωμα": "https://anthithoma-psychologist.gr", // Ανθή Θωμά
  "cristina donica": "https://methexis-donica.gr", // Μέθεξις
  "Χαρά Τζοάνου": "https://charatzoanou.gr", // Χαρά Τζοάνου
  "Εβελίνα Αποστολάκη": "https://evelina-apostolaki.gr", // Εβελίνα Αποστολάκη, MSc
  "Gina Panag": "https://ginapanagiotidi.gr", // Τζίνα Παναγιωτίδη
  "Δήμητρα Μπότσογλου": "https://psychotopos.gr", // Δήμητρα Μπότσογλου
  "Eva Papageorgiou": "https://papageorgioupsy.gr", // Εύα Παπαγεωργίου
  "Konstantinos Pefanis": "https://pefanis-therapy.gr", // Κωνσταντίνος Πεφάνης
  "Neni Dede": "https://dede-psychologist.gr", // Έλενα Δεδέ, MA, BSc (Hons)
  "Χριστίνα Πατρίδου": "https://patridou-psychologist.gr", // Χριστίνα Πατρίδου, MSc
  "aris xenellis": "https://arisxenellis.gr", // Άρης Ξενέλλης
  "Vasiliki Stergiopoulou": "https://vstergiopoulou.gr", // Βασιλική Στεργιοπούλου
  "Χρύσα Χατζηχαραλάμπου": "https://chrysachatzicharalampou.gr", // Χρύσα Χατζηχαραλάμπου
  "Μυρσίνη Βασίλα": "https://dentalphilosophy.gr", // Άρτεμις Βασίλα DDS, MSc & Μυρσίνη Βασίλα BSc, DDS
  "Evi St": "https://psychotherapyis4me.gr", // Παρασκευή Σταματάκη
  "Mary Tabaki": "https://tampaki-psychologist.gr", // Μαίρη Ταμπάκη
  "Sofia Str": "https://strekla-psychologist.gr", // Σοφία Στρέκλα
  "ΑΝΘΙΑ ΣΟΥΦΛΑ": "https://anthiasoufla.gr", // Ανθία Σούφλα
  "Martha Plessa": "https://marthaplessa-psychotherapy.gr", // Μάρθα Πλέσσα
  "Evan Papadopoulos": "https://evanpapadopoulos.gr", // Ευάγγελος Παπαδόπουλος
  "Katerina Aranitou": "https://aranitoukaterina-psychologist.gr", // Αικατερίνη Αρανίτου
  "Θανάσης Γιαννουλής": "https://giannoulis-psychotherapy.gr", // Θανάσης Γιαννούλης
  "Dionysis Pyrovolisianos": "https://pyrovolisianos.gr", // Διονύσης Πυροβολισιάνος
  "Sotirios K": "https://katranas-kardiologos.gr", // Δρ. Σωτήριος Κατράνας, Ειδικός Καρδιολόγος
  "Evaggelia Sagga": "https://sagga-psychologist.gr", // Ευαγγελία Σάγγα Ψυχολόγος MSc
  "zoe asmanoglou": "https://zoiasmanoglou.gr", // Ζωή Ασμάνογλου
  "Thanos Mariolis": "https://athmariolis-therapy.gr", // Αθανάσιος Μαριόλης
  "nikolia savvopoulou": "https://nikoliasavvopoulou.gr", // Νικολία Σαββοπούλου, MSc
  "Marina Sitareniou": "https://marinasitareniou.gr", // Μαρίνα Σιταρένιου BSc, MSc, PgD
  "Άννα Βούλτσιου": "https://voultsiou-psychotherapy.gr", // Άννα Βούλτσιου
  "elena kontou": "https://elenakontou-psy.gr", // Έλενα Κοντού
  "Tonia Kapsanaki": "https://toniakapsanaki.gr", // Τόνια Καψανάκη
  "Thomi Koutsi": "https://koutsaliari-psychologist.gr", // Θωμαή Κουτσαλιάρη
  "Ιωαννα Σιδηροπουλου Κλιαφα": "https://sidiropoulou-psy.gr", // Ιωάννα Σιδηροπούλου
  "Athanasia Gkika": "https://athanasiagkika-psychologist.gr", // Αθανασία Γκίκα
  "Sofia Diamantopoulou": "https://sofiadiamantopoulou-psychologist.gr", // Σοφία Διαμαντοπούλου
  "Maria Zerva": "https://zerva-psychologist.gr", // Μαρία Ζέρβα
  "Konstantina M.": "https://konstantinamarketi-psychotherapist.gr", // Κωνσταντίνα Μαρκέτη, MSc
  "Konstantinos Chatzis": "https://chatziskonstantinos.gr", // Κωνσταντίνος Χατζής
  "SOFIA KOTSALIDOU": "https://sofiakotsalidou.gr", // Σοφία Κοτσαλίδου
  "Nikol Panda": "https://panagiotopoulou-psyxologos.gr", // Νικολέτα Παναγιωτοπούλου
  "Έλενα Χριστοδουλάκη": "https://christodoulaki-psychologist.gr", // Έλενα Χριστοδουλάκη
  "Κατερινα Τεννε": "https://tenne-psychologist.gr", // Κατερίνα Τεννέ
  "xrusa mpakolia": "https://bakolia-psychotherapy.gr", // Χρύσα Μπακολιά
  "Panagiotis T.": "https://panagiotistagaris.gr", // Παναγιώτης Τάγαρης
  "Dionysia Kontaxopoulou": "https://dkontaxopoulou.gr", // Διονυσία Κονταξοπούλου
  "ΧΡΗΣΤΟΣ ΚΑΡΥΔΑΣ": "https://chkaridas.gr", // Χρήστος Καρύδας
  "Σάντυ Λιανέρη": "https://slianeri-psychotherapy.gr", // Σάντυ Λιανέρη
  "Aggelos Pittaras": "https://pittaras-psychotherapy.gr", // Άγγελος Πιτταράς
  "Thodoris Demeroutis": "http://demeroutis-psychverse.gr", // Θοδωρής Δεμερούτης Ψυχολόγος
  "Stefania Karazoli": "https://stefaniakarazoli-psychologist.gr", // Στεφανία Καραζόλη
  "deppy pantazi": "https://deppy-psy.gr", // Ντέπη Πανταζή
  "Panagiota Kalliontzaki": "https://yiota-kalliontzaki.gr", // Γιώτα Καλλιοντζάκη
  "Roni Tzatzadaki": "https://matronitzatzadaki.gr", // Ματρώνη Τζατζαδάκη
  "Yannis Bafakis": "https://bafakiscardio.gr", // Γιάννης Μπαφάκης
  "Αδαμαντία Γκίκα": "https://gkika-psychologist.gr", // Αδαμαντία Γκίκα
  "Christina Simitsi": "https://drsimitsi-psychologist.gr", // Χριστίνα Σιμιτσή Ψυχολόγος
  "FANI PAKOU": "https://fanipakou.gr", // Φανή Πάκου
  "Χριστόφορος Παπ": "https://foodintherapy.gr", // Food in Therapy
  "maria baloti": "https://baloti-psychologist.gr", // Μαρία Μπαλωτή
  "Constantina Skourla": "https://skourla.gr", // Κωνσταντίνα Σκουρλά
  "Ariadne Ntinopoulou": "https://healyouwell.gr", // ΑΡΙΑΔΝΗ ΝΤΙΝΟΠΟΥΛΟΥ Ψυχολόγος
  "Σαββινα Εμιρζα": "https://skepsyxi.gr", // Σαββίνα Εμιρζά Ψυχολόγος
  "Katerina Keletseki": "https://keletseki-psychotherapy.gr", // Κατερίνα Κελετσέκη Ψυχολόγος
  "Cristina Alatsi": "https://christinaalatsi.gr", // Χριστίνα Αλάτση Σύμβουλος
  "Ilianaki b96": "https://boubaliki-psychologos.gr", // Ηλιάνα Μπουμπαλίκη Ψυχολόγος
  "Εύα Λα": "https://evalamprinou-psychologist.gr", // Εύα Λαμπρινού Ψυχολόγος
  "Alex Parthenis": "https://parthenis-psychotherapy.gr", // Αλέξανδρος Παρθένης Ψυχολόγος
  "Anestis Andrikou": "https://andrikou-systherapy.gr", // Αναστάσιος Ανδρίκου
  "Maira Gerou": "https://mairagerou-psychologist.gr", // Μάιρα Γέρου, Ψυχολόγος
  "Plan For A Miracle": "https://online-psychotherapy-hub.eu", // Plan For A Miracle
  "Maro Manthou (Plan For A Miracle)": "https://online-psychotherapy-hub.eu", // Plan For A Miracle
  "lamprini polumeropoulou": "https://polymeropoulou-psychologos.gr", // Λαμπρινή Πολυμεροπούλου (MSc), Ψυχολόγος
  "Παναγιώτα Καραμπέτσου": "https://giotakarampetsou.gr", // Καραμπέτσου Παναγιώτα - Ψυχολόγος
  "Angeliki Vrettou": "https://angelikivrettou.gr", // Αγγελική Βρεττού Ψυχοθεραπεύτρια
  "Jo Asimak": "https://asimakopoulou-psychologos.gr", // Ιωάννα Ασημακοπούλου
  "Laurance Menetian": "https://menetian-psychologist.gr", // Μενετιάν Λοράνς - Ψυχολόγος
  "Avra Logotheti": "https://avralogotheti.gr", // Αύρα Λογοθέτη
  "Eri M": "https://mitsi-psychologist.gr", // ERIOLA MITSI Ψυχολόγος
  "Elena Kovaiou": "https://elenakovaiou-psychologist.gr", // Έλενα Κωβαίου
  "Ioanna K": "https://karouzioanna-psychologist.gr", // Ιωάννα Καρούζη
  "Giouli Skondra": "https://giouliskondra-therapy.gr", // Σκόνδρα Παναγιούλα – Ψυχολόγος
  "Ιουλία Φατούρου": "https://fatourou-ioulia-psychologos.gr", // Φατούρου Ιουλία - Ψυχολόγος
  "Δήμητρα Νάκου": "https://nakou-psychologos.gr", // Νάκου Δήμητρα - Ψυχολόγος
  "Roza": "https://roza-psychologist.gr", // Χαρουτιουνιάν Ρόζα - Ψυχολόγος
  "elpida tal": "https://talamagka-psychologos.gr", // Ταλαμάγκα Ελπίδα - Ψυχολόγος
  "Sofia Vassiliadou": "https://sofiavassiliadou-psyxiatros.gr", // Σοφία Βασιλειάδου
  "Smaragda Dim.": "https://smaragdadimitra.gr", // Σμαράγδα Δημητρά
  "Theodora Sizopoulou": "https://dorasizopoulou.gr", // Θεοδώρα Σιζοπούλου, MSc
  "Fani Filippopoulou": "https://filippopoulou-psyxologos.gr", // Φανή Φιλιπποπούλου
  "Xrysa Oikonomou": "https://oikonomou-psyxologos.gr", // Χρυσούλα Οικονόμου, MSc
  "Εμμανουέλα Παππά": "https://pappa-psyxologos.gr", // Εμμανουέλα Παππά
  "Eleni T": "https://tsialiafa-dentalcare.gr", // Dr. Ελένη Τσιαλιάφα DDS, MSc
  "Stratos “Strat” Chatzi": "https://chatzistratis-paidiatros.gr", // Στράτος Χατζηστρατής
  "Maria Fasoula": "https://occludent.gr", // Μαρία Φασούλα, DDS, MSc
  "xenia papa": "https://eye-orl.gr", // Ξένια Παπαβραμίδου & Σταμάτιος Δρυς
  "Βασιλική Μπέλλου": "https://anesti-mpellou-paidiatros.gr", // Βάσω Γ. Ανέστη Μπέλλου
  "lg robot": "https://astra-paidiatros.gr", // Ελένη Άστρα
  "ΘΩΜΑΗ ΖΟΡΜΠΑ": "https://zormpa-dentist.gr", // Θωμαή Ζορμπά
  "Glynos George": "https://rhodesdentist.gr", // Γεώργιος Γλυνός
};
