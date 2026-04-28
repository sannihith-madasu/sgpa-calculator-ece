import React, { useState } from 'react';

const ACADEMIC_DATA = {
  "2-1": {
    totalCredits: 20,
    subjects: [
      { code: "9HC63", name: "Soft Skills Lab", credits: 2.0 },
      { code: "9HC14", name: "Complex Var & Transform Tech", credits: 3.0 },
      { code: "9CC01", name: "Electronic Devices & Circuits", credits: 3.0 },
      { code: "9ZC01", name: "Business Econ & Fin Analysis", credits: 3.0 },
      { code: "9CC71", name: "EDC Lab", credits: 1.5 },
      { code: "9CC02", name: "Signals and Systems", credits: 3.0 },
      { code: "9CC03", name: "PTSP", credits: 3.0 },
      { code: "9AC72", name: "ECNA Lab", credits: 1.5 },
    ]
  },
  "2-2": {
    totalCredits: 24,
    subjects: [
      { code: "9CC04", name: "Analog Circuits", credits: 3.0 },
      { code: "9CC06", name: "Analog & Digital Comms", credits: 3.0 },
      { code: "9CC05", name: "Digital Logic Design", credits: 3.0 },
      { code: "9C407", name: "EM Waves & Transmission Lines", credits: 3.0},
      { code: "9HC16", name: "Quant Aptitude & Log Reasoning", credits: 3.0 },
      { code: "9HC03", name: "Universal Human Values", credits: 3.0 },
      { code: "9CC72", name: "Analog Circuits Lab", credits: 1.5 },
      { code: "9C473", name: "BS and DLD Lab", credits: 2.0 },
      { code: "9CC74", name: "ADC Lab", credits: 1.5 },
      { code: "9C461", name: "Technical Seminar", credits: 1.0 },
    ]
  },
  "3-1": {
    totalCredits: 21,
    subjects: [
      { code: "9CC08", name: "Digital Signal Processing", credits: 3.0 },
      { code: "9CC09", name: "IC Applications", credits: 3.0 },
      { code: "9C510", name: "Antennas and Wave Propagations", credits: 3.0 },
      { code: "PE-1",  name: "Professional Elective-I", credits: 3.0 },
      { code: "9AC07", name: "Linear Control Systems", credits: 3.0 },
      { code: "9CC75", name: "DS Processing Lab", credits: 2.0 },
      { code: "9CC76", name: "IC Applications Lab", credits: 1.5 },
      { code: "9C578", name: "Antenna Simulation Lab", credits: 1.5 },
      { code: "9C591", name: "Summer Industry Internship-I", credits: 1.0 },
    ]
  },
  "3-2": {
    totalCredits: 21,
    subjects: [
      { code: "9C611", name: "Microwave & Optical Comms", credits: 3.0 },
      { code: "9C612", name: "VLSI Technology and Design", credits: 3.0 },
      { code: "9DC05", name: "Microprocessors and Microcontrollers", credits: 3.0 },
      { code: "PE-2",  name: "Professional Elective-II", credits: 3.0 },
      { code: "OE-1",  name: "Open Elective-I", credits: 3.0 },
      { code: "9C679", name: "MOC Lab", credits: 2.0 },
      { code: "9C677", name: "VLSI Tech and Design Lab", credits: 1.5 },
      { code: "9DC71", name: "MPMC Lab", credits: 1.5 },
      { code: "9C662", name: "Comprehensive Viva Voce", credits: 1.0 },
    ]
  },
  "4-1": {
    totalCredits: 21,
    subjects: [
      { code: "9C713", name: "IoT and Applications", credits: 3.0 },
      { code: "9C714", name: "Advanced Comms and Networks", credits: 3.0 },
      { code: "9C715", name: "Computer Networks", credits: 3.0 },
      { code: "PE-3",  name: "Professional Elective-III", credits: 3.0 },
      { code: "PE-4",  name: "Professional Elective-IV", credits: 3.0 },
      { code: "OE-2",  name: "Open Elective-II", credits: 3.0 },
      { code: "9C780", name: "IoT and Applications Lab", credits: 1.0 },
      { code: "9C781", name: "Advanced Comms and Networks Lab", credits: 1.0 },
      { code: "9C792", name: "Summer Industry Internship-II", credits: 1.0 },
    ]
  },
  "4-2": {
    totalCredits: 16,
    subjects: [
      { code: "PE-5",  name: "Professional Elective-V", credits: 3.0 },
      { code: "OE-3",  name: "Open Elective-III", credits: 3.0 },
      { code: "9C893", name: "Major Project", credits: 10.0 },
    ]
  }
};

const GRADE_POINTS = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "F": 0, "Ab": 0 };
const VALID_GRADES = Object.keys(GRADE_POINTS);

export default function App() {
  const [selectedSem, setSelectedSem] = useState("2-1");
  const [grades, setGrades] = useState({});
  const [pasteText, setPasteText] = useState("");
  const [isPasteOpen, setIsPasteOpen] = useState(false);

  const handleGradeChange = (code, grade) => {
    if (!grade) {
      const newGrades = { ...grades };
      delete newGrades[code];
      setGrades(newGrades);
    } else {
      setGrades({ ...grades, [code]: grade });
    }
  };

  const handleParse = () => {
    if (!pasteText.trim()) return;
    const currentSubjects = ACADEMIC_DATA[selectedSem].subjects;
    let newGrades = { ...grades };
    let parsedCount = 0;

    currentSubjects.forEach(sub => {
      // Regex mapping the subject code followed by any amount of non-newline spacing/text and eventually a grade in parentheses. We will match more loosely since PDF pastes might have newline.
      // E.g.: "9HC63 ... 85(A+)"
      // Find the subject code in pasteText:
      const subIndex = pasteText.indexOf(sub.code);
      if (subIndex !== -1) {
        // Take a chunk of text after the code
        const chunk = pasteText.substring(subIndex, subIndex + 100);
        // Look for the first grade-like pattern in parenthesis: (O), (A+), etc.
        const match = chunk.match(/\((O|A\+|A|B\+|B|C|F|Ab)\)/);
        if (match) {
          newGrades[sub.code] = match[1];
          parsedCount++;
        }
      }
    });

    if (parsedCount > 0) {
      setGrades(newGrades);
      setPasteText("");
      alert(`Successfully parsed ${parsedCount} subjects!`);
      setIsPasteOpen(false);
    } else {
      alert("No matching grades found for this semester. Make sure you selected the correct semester and pasted valid data containing subject codes.");
    }
  };

  const handleSemesterChange = (sem) => {
    if (sem !== selectedSem) {
      setSelectedSem(sem);
      setGrades({});
    }
  };

  const calculateSGPA = (semKey) => {
    const semData = ACADEMIC_DATA[semKey];
    let totalScore = 0;
    let creditsCalculated = 0;

    semData.subjects.forEach(sub => {
      if (sub.credits > 0 && grades[sub.code]) {
        totalScore += (sub.credits * GRADE_POINTS[grades[sub.code]]);
        creditsCalculated += sub.credits;
      }
    });

    if (creditsCalculated === 0) return 0;
    // Standard regulation SGPA divides by all credits of semester or just attempted? Usually by all attemptable OR all semester credits
    return (totalScore / semData.totalCredits).toFixed(2);
  };

  const isSemesterComplete = ACADEMIC_DATA[selectedSem].subjects.every(
    (sub) => VALID_GRADES.includes(grades[sub.code])
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#050509] selection:bg-indigo-500/30 text-zinc-100 font-sans relative">
      <header className="border-b border-zinc-900 bg-[#050509]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="w-full flex items-center justify-between px-8 py-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></span>
            SGPA Calculator
          </h1>
          <button
            onClick={() => setIsPasteOpen(!isPasteOpen)}
            className="text-sm font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
          >
            {isPasteOpen ? "Close Import" : "Import PDF"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        
        {/* Top Controls */}
        <section className="w-full flex justify-center my-8">
          {/* Segmented Selector */}
          <div className="bg-zinc-950/80 p-1.5 rounded-full border border-zinc-800 flex gap-1 inline-flex shadow-lg w-full md:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide max-w-full">
            {Object.keys(ACADEMIC_DATA).map(sem => (
              <button
                key={sem}
                onClick={() => handleSemesterChange(sem)}
                className={`flex-1 md:flex-none rounded-full px-6 py-2 transition-all font-medium text-sm whitespace-nowrap ${
                  selectedSem === sem
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </section>

        {/* Smart Paste Drawer */}
        {isPasteOpen && (
          <section className="bg-[#0d0d14]/80 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-base font-semibold text-zinc-100">Smart Paste Engine</h2>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/30 px-2.5 py-0.5 rounded-md border border-cyan-900/50">Beta</span>
            </div>
            <p className="text-sm text-zinc-500 mb-5 leading-relaxed">
              Copy the giant block of text directly from your JNTUH SNIST PDF results and paste it here. We'll extract your grades automatically.
            </p>
            <textarea
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors resize-none font-mono text-sm leading-loose mb-5 shadow-inner"
              rows="5"
              placeholder="Example: 9HC63 ... 85(A+)"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPasteOpen(false)}
                className="bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleParse}
                className="bg-white text-black hover:bg-zinc-200 font-bold py-2.5 px-8 rounded-lg transition-colors text-sm shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
              >
                Parse Grades
              </button>
            </div>
          </section>
        )}

        {/* Dynamic Subject Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-300">Academic Subjects</h3>
            <span className="text-sm font-medium text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
              {ACADEMIC_DATA[selectedSem].totalCredits} Total Credits
            </span>
          </div>

          <div className="space-y-4 mb-32">
            {ACADEMIC_DATA[selectedSem].subjects.map((sub) => (
              <div 
                key={sub.code} 
                className="grid grid-cols-1 md:grid-cols-12 items-center gap-5 md:gap-4 p-5 bg-[#0d0d14] border border-zinc-900 rounded-2xl hover:border-zinc-800 hover:shadow-[0_0_15px_-3px_rgba(34,211,238,0.1)] transition-all group"
              >
                {/* Column 1: Meta (Span 6) */}
                <div className="md:col-span-6 flex flex-col md:flex-row items-start md:items-center gap-3">
                  <span className="font-mono text-xs font-bold tracking-wider text-zinc-500 bg-zinc-950 h-8 px-3 flex items-center justify-center rounded-md border border-zinc-800/50">
                    {sub.code}
                  </span>
                  <span className="text-base md:text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                    {sub.name}
                  </span>
                </div>

                {/* Column 2: Credits (Span 2) */}
                <div className="md:col-span-2 text-sm font-medium text-zinc-500 flex items-center md:justify-center gap-2">
                  <span className="md:hidden text-xs text-zinc-600 uppercase tracking-widest font-semibold">Credits:</span>
                  <span className="bg-zinc-900/50 h-8 px-3 flex items-center justify-center rounded-md text-xs border border-zinc-800/50">{sub.credits.toFixed(1)} C</span>
                </div>

                {/* Column 3: Control (Span 4) */}
                <div className="md:col-span-4 relative group/select">
                  <select
                    className="w-full appearance-none bg-zinc-950 border border-zinc-700 text-zinc-100 font-bold text-center text-base md:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 py-3.5 pl-4 pr-10 transition-colors cursor-pointer hover:border-zinc-500 shadow-inner"
                    value={grades[sub.code] || ""}
                    onChange={(e) => handleGradeChange(sub.code, e.target.value)}
                  >
                    <option value="" className="text-zinc-600 font-normal">Select Grade</option>
                    {VALID_GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-500 group-hover/select:text-cyan-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Results HUD */}
      {isSemesterComplete && (
        <footer className="fixed bottom-8 right-8 z-50 px-8 py-4 rounded-full backdrop-blur-2xl bg-[#050509]/80 border border-zinc-800 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-6 transition-all animate-[slideIn_0.3s_ease-out_forwards]">
          <div className="flex flex-col items-center justify-center text-center w-full">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
              Semester SGPA
            </span>
            <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">
              {calculateSGPA(selectedSem)}
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
