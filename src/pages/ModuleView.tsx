import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGamificationStore } from '../store/gamificationStore'

interface ModuleViewProps {
  moduleId: string
}

export const ModuleView: React.FC<ModuleViewProps> = ({ moduleId }) => {
  const { addPoints, unlockBadge, completeModule } = useGamificationStore()
  const [code, setCode] = useState(`public class HelloWorld {
    static void Main() {
        // Schreibe deinen Code hier!
        Console.WriteLine("Hello, LernLix!");
    }
}`)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [completedSteps, setCompletedSteps] = useState(0)

  const module = {
    id: 'chatbot-quick',
    title: '🤖 Erstelle deinen ersten Chatbot',
    type: 'quick-start',
    duration: 8,
    points: 50,
    steps: [
      {
        id: 1,
        title: 'Input-Feld vorbereiten',
        description: 'Erstelle ein Input-Feld für Benutzereingaben',
        hint: 'Console.ReadLine() liest eine Zeile ein',
        code: `string userInput = Console.ReadLine();`
      },
      {
        id: 2,
        title: 'Einfache Antwort-Logik',
        description: 'Schreibe eine if-Abfrage für einfache Antworten',
        hint: 'Nutze if (userInput == "Hallo") { ... }',
        code: `if (userInput == "Hallo") {
    Console.WriteLine("Hallo! Wie geht es dir?");
}`
      },
      {
        id: 3,
        title: 'Chatbot-Interface testen',
        description: 'Teste dein Chatbot-Programm',
        hint: 'Klicke auf "Ausführen" um dein Programm zu starten',
        code: ``
      },
      {
        id: 4,
        title: 'Erfolg speichern',
        description: 'Speichere dein Ergebnis und erhalte Punkte',
        hint: 'Klicke auf "Abschließen" um das Modul zu beenden',
        code: ``
      }
    ]
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    // Simuliere Code-Ausführung
    setTimeout(() => {
      setOutput('Hello, LernLix!\n✅ Programm erfolgreich ausgeführt!')
      setIsRunning(false)
      if (completedSteps < module.steps.length) {
        const newCompleted = completedSteps + 1
        setCompletedSteps(newCompleted)
      }
    }, 1500)
  }

  const handleCompleteModule = () => {
    addPoints(module.points, `Modul: ${module.title}`)
    completeModule(module.id)
    unlockBadge({
      id: 'first-coder',
      name: 'First Coder',
      description: 'Dein erstes Modul abgeschlossen',
      icon: '💻'
    })
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
            <p className="text-blue-100">Quick-Start Tutorial • {module.duration} Minuten</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">🏆 {module.points}</div>
            <p className="text-blue-100">Punkte</p>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 rounded-xl p-4 border border-purple-500/20"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-semibold">Fortschritt</span>
          <span className="text-purple-300">{completedSteps}/{module.steps.length} Schritte</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps / module.steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-4">✍️ Code-Editor</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm border border-gray-700 focus:border-purple-500 focus:outline-none"
              spellCheck="false"
            />
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {isRunning ? '⏳ Wird ausgeführt...' : '▶️ Code ausführen'}
            </button>
          </div>

          {/* Output */}
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl p-4 border border-green-500/30"
            >
              <h3 className="text-green-400 font-bold mb-2">📊 Ausgabe:</h3>
              <pre className="text-green-300 text-sm whitespace-pre-wrap">{output}</pre>
            </motion.div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
            <h2 className="text-xl font-bold text-white mb-4">📋 Aufgaben</h2>
            <div className="space-y-3">
              {module.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 transition ${
                    index < completedSteps
                      ? 'bg-green-900/30 border-green-500/50'
                      : index === completedSteps
                      ? 'bg-purple-900/30 border-purple-500 shadow-lg shadow-purple-500/50'
                      : 'bg-gray-700/30 border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {index < completedSteps ? '✅' : index === completedSteps ? '🎯' : '⏳'}
                    </span>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        index < completedSteps ? 'text-green-300' : 'text-white'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                      {step.hint && index === completedSteps && (
                        <p className="text-xs text-yellow-300 mt-2 bg-yellow-900/30 p-2 rounded">
                          💡 Tipp: {step.hint}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          {completedSteps === module.steps.length && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCompleteModule}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105"
            >
              🎉 Modul abschließen!
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

