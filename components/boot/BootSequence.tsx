"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Power, CheckCircle, AlertCircle, Cpu, HardDrive, Wifi, Shield, Monitor, Zap, Database, Network, Settings, Terminal, Lock, Eye, Activity, Gauge } from 'lucide-react';

interface BootSequenceProps {
  onBootComplete: () => void;
}

interface BootStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  details: string[];
  address?: string;
}

interface SystemInfo {
  cpu: string;
  memory: string;
  storage: string;
  gpu: string;
  network: string;
  version: string;
  uptime: number;
}

export default function BootSequence({ onBootComplete }: BootSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [bootPhase, setBootPhase] = useState<'logo' | 'bios' | 'kernel' | 'services' | 'desktop'>('logo');
  const terminalRef = useRef<HTMLDivElement>(null);

  // Get real system information
  const getRealSystemInfo = (): SystemInfo => {
    const nav = navigator as any;
    const memory = (performance as any).memory;

    return {
      cpu: nav.hardwareConcurrency ? `${nav.hardwareConcurrency}-Core Processor` : 'Multi-Core Processor',
      memory: memory ? `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB Available` : '8192MB Available',
      storage: 'NVMe SSD 512GB',
      gpu: 'Integrated Graphics',
      network: nav.onLine ? 'Connected' : 'Disconnected',
      version: 'Solario OS v2.1.0 Build 20241214.1847',
      uptime: Date.now()
    };
  };

  const [bootSteps, setBootSteps] = useState<BootStep[]>([
    {
      id: 'bios',
      name: 'BIOS Initialization',
      description: 'Checking system firmware...',
      icon: <Power className="w-5 h-5" />,
      duration: 2000,
      status: 'pending',
      details: [
        'UEFI BIOS v2.1.4',
        'Secure Boot: Enabled',
        'TPM 2.0: Active',
        'Fast Boot: Enabled'
      ],
      address: '0xFFFF0000'
    },
    {
      id: 'cpu',
      name: 'CPU Detection',
      description: 'Initializing processor cores...',
      icon: <Cpu className="w-5 h-5" />,
      duration: 1800,
      status: 'pending',
      details: [
        `Cores: ${navigator.hardwareConcurrency || 8}`,
        'Architecture: x86_64',
        'Virtualization: Enabled',
        'Cache: L1/L2/L3 Active'
      ],
      address: '0x00100000'
    },
    {
      id: 'memory',
      name: 'Memory Test',
      description: 'Testing system RAM...',
      icon: <Database className="w-5 h-5" />,
      duration: 2200,
      status: 'pending',
      details: [
        'DDR4-3200 Detected',
        'ECC: Disabled',
        'Dual Channel Mode',
        'Memory Map: OK'
      ],
      address: '0x00000000'
    },
    {
      id: 'security',
      name: 'Security Check',
      description: 'Verifying system integrity...',
      icon: <Lock className="w-5 h-5" />,
      duration: 1500,
      status: 'pending',
      details: [
        'Secure Boot Verification',
        'Kernel Signature Valid',
        'Anti-malware Scan',
        'Firewall Initialization'
      ],
      address: '0x7C00'
    },
    {
      id: 'graphics',
      name: 'Graphics Init',
      description: 'Loading display drivers...',
      icon: <Monitor className="w-5 h-5" />,
      duration: 1600,
      status: 'pending',
      details: [
        'GPU Detection: Integrated',
        'Display Resolution: Auto',
        'Hardware Acceleration: ON',
        'Multi-monitor Support: Ready'
      ],
      address: '0xA0000'
    },
    {
      id: 'performance',
      name: 'Performance Tuning',
      description: 'Optimizing system performance...',
      icon: <Gauge className="w-5 h-5" />,
      duration: 1400,
      status: 'pending',
      details: [
        'CPU Governor: Performance',
        'Power Management: Balanced',
        'Thermal Control: Active',
        'Boost Clock: Enabled'
      ],
      address: '0x40000000'
    },
    {
      id: 'storage',
      name: 'Storage Detection',
      description: 'Scanning storage devices...',
      icon: <HardDrive className="w-5 h-5" />,
      duration: 1500,
      status: 'pending',
      details: [
        'NVMe SSD: 512GB',
        'SMART Status: OK',
        'File System: ext4',
        'Boot Partition: /dev/nvme0n1p1'
      ],
      address: '0x01F0'
    },
    {
      id: 'network',
      name: 'Network Stack',
      description: 'Initializing network interfaces...',
      icon: <Network className="w-5 h-5" />,
      duration: 1600,
      status: 'pending',
      details: [
        'Ethernet: eth0 UP',
        'WiFi: wlan0 READY',
        'IPv6: Enabled',
        'DNS: 8.8.8.8'
      ],
      address: '0x0300'
    },
    {
      id: 'kernel',
      name: 'Kernel Loading',
      description: 'Loading Solario kernel...',
      icon: <Terminal className="w-5 h-5" />,
      duration: 2500,
      status: 'pending',
      details: [
        'Kernel: solario-6.2.0',
        'Init System: systemd',
        'Security: SELinux',
        'Modules: 247 loaded'
      ],
      address: '0xC0000000'
    },
    {
      id: 'services',
      name: 'System Services',
      description: 'Starting core services...',
      icon: <Settings className="w-5 h-5" />,
      duration: 2000,
      status: 'pending',
      details: [
        'Desktop Manager: Started',
        'Audio System: PulseAudio',
        'Display Server: Wayland',
        'User Session: Ready'
      ],
      address: '0x08000000'
    }
  ]);

  useEffect(() => {
    // Get system info immediately
    setSystemInfo(getRealSystemInfo());

    // Show logo for 3 seconds, then start boot sequence
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
      setShowTerminal(true);
      setBootPhase('kernel');
      startBootSequence();
    }, 3000);

    return () => clearTimeout(logoTimer);
  }, []);

  // Start diagnostics phase with hardware checks
  const startDiagnosticsPhase = () => {
    const diagnosticTests = [
      { name: 'CPU Self-Test', status: 'running', progress: 0 },
      { name: 'Memory Check', status: 'pending', progress: 0 },
      { name: 'Storage Scan', status: 'pending', progress: 0 },
      { name: 'Network Test', status: 'pending', progress: 0 },
      { name: 'Security Verify', status: 'pending', progress: 0 }
    ];

    setDiagnostics(diagnosticTests);

    // Run each diagnostic test
    diagnosticTests.forEach((test, index) => {
      setTimeout(() => {
        runDiagnosticTest(index);
      }, index * 1500);
    });

    // After diagnostics, move to terminal
    setTimeout(() => {
      setShowDiagnostics(false);
      setShowTerminal(true);
      setBootPhase('kernel');
      startBootSequence();
    }, 8000);
  };

  const runDiagnosticTest = (testIndex: number) => {
    setDiagnostics(prev =>
      prev.map((test, i) =>
        i === testIndex ? { ...test, status: 'running' } : test
      )
    );

    // Simulate test progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setDiagnostics(prev =>
          prev.map((test, i) =>
            i === testIndex ? { ...test, status: 'completed', progress: 100 } : test
          )
        );

        // Start next test
        if (testIndex < 4) {
          setDiagnostics(prev =>
            prev.map((test, i) =>
              i === testIndex + 1 ? { ...test, status: 'running' } : test
            )
          );
        }
      } else {
        setDiagnostics(prev =>
          prev.map((test, i) =>
            i === testIndex ? { ...test, progress } : test
          )
        );
      }
    }, 100);
  };

  const addTerminalLine = (line: string) => {
    setTerminalOutput(prev => [...prev, line]);
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 50);
  };

  const startBootSequence = () => {
    let stepIndex = 0;

    const processStep = () => {
      if (stepIndex >= bootSteps.length) {
        // Boot complete
        addTerminalLine('');
        addTerminalLine('[  OK  ] Boot sequence completed successfully');
        addTerminalLine('[  OK  ] Starting Solario Desktop Environment...');
        setTimeout(() => {
          onBootComplete();
        }, 1500);
        return;
      }

      const currentBootStep = bootSteps[stepIndex];

      // Add terminal output for step start
      addTerminalLine(`[${currentBootStep.address}] ${currentBootStep.name}...`);

      // Mark current step as running
      setBootSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === stepIndex ? 'running' : step.status
      })));

      setCurrentStep(stepIndex);

      let stepProgress = 0;
      let detailIndex = 0;

      // Add detailed terminal output
      const detailInterval = setInterval(() => {
        if (detailIndex < currentBootStep.details.length) {
          addTerminalLine(`    ${currentBootStep.details[detailIndex]}`);
          detailIndex++;
        }
      }, currentBootStep.duration / (currentBootStep.details.length + 2));

      // Animate progress for current step
      const progressInterval = setInterval(() => {
        stepProgress += Math.random() * 12 + 3;
        if (stepProgress >= 100) {
          stepProgress = 100;
          clearInterval(progressInterval);
          clearInterval(detailInterval);

          // Mark step as completed
          setBootSteps(prev => prev.map((step, index) => ({
            ...step,
            status: index === stepIndex ? 'completed' : step.status
          })));

          addTerminalLine(`[  OK  ] ${currentBootStep.name} completed`);
          addTerminalLine('');

          // Move to next step
          stepIndex++;
          setTimeout(processStep, 300);
        }

        // Update overall progress
        const overallProgress = ((stepIndex * 100) + stepProgress) / bootSteps.length;
        setProgress(Math.min(overallProgress, 100));
      }, currentBootStep.duration / 25);
    };

    // Initial boot messages
    addTerminalLine('Solario OS Boot Loader v2.1.0 Build 20241214.1847');
    addTerminalLine('Copyright (C) 2024 Solario Systems');
    addTerminalLine('');
    addTerminalLine('Starting boot sequence...');
    addTerminalLine('');

    setTimeout(processStep, 800);
  };


  if (showLogo) {
    // Generate deterministic particle positions to avoid hydration errors
    const particles = Array.from({ length: 50 }, (_, i) => {
      const seed = i * 12345; // Deterministic seed
      const pseudoRandom1 = ((seed * 9301 + 49297) % 233280) / 233280;
      const pseudoRandom2 = (((seed + 1) * 9301 + 49297) % 233280) / 233280;
      const pseudoRandom3 = (((seed + 2) * 9301 + 49297) % 233280) / 233280;
      const pseudoRandom4 = (((seed + 3) * 9301 + 49297) % 233280) / 233280;

      return {
        left: pseudoRandom1 * 100,
        top: pseudoRandom2 * 100,
        delay: pseudoRandom3 * 3,
        duration: 2 + pseudoRandom4 * 3
      };
    });

    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          {/* Enhanced Solario Logo */}
          <div className="mb-12">
            <div className="w-40 h-40 mx-auto mb-8 relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400 rounded-full animate-spin opacity-30"
                   style={{ animationDuration: '8s' }}></div>
              <div className="absolute inset-2 bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-black rounded-full flex items-center justify-center border border-gray-800">
                <div className="text-white text-5xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  S
                </div>
              </div>
              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
                <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>

            <h1 className="text-8xl font-bold text-white mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-teal-300 bg-clip-text text-transparent animate-pulse">
              SOLARIO
            </h1>
            <p className="text-3xl text-gray-300 font-light tracking-widest mb-4">
              OPERATING SYSTEM
            </p>
            <div className="space-y-2">
              <p className="text-lg text-gray-400 font-mono">
                Version 2.1.0 • Build 20241214.1847
              </p>
              <p className="text-sm text-gray-500">
                Quantum-Enhanced • Neural Processing • Secure Boot
              </p>
            </div>
          </div>

          {/* Enhanced loading indicator */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="text-lg font-medium">Initializing System...</span>
            </div>

            {/* System info preview */}
            {systemInfo && (
              <div className="mt-8 space-y-2 text-xs text-gray-600 font-mono">
                <div>CPU: {systemInfo.cpu}</div>
                <div>Memory: {systemInfo.memory}</div>
                <div>Network: {systemInfo.network}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showTerminal) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
        {/* Matrix-style background effect */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }, (_, i) => {
            const seed = i * 54321;
            const pseudoRandom1 = ((seed * 9301 + 49297) % 233280) / 233280;
            const pseudoRandom2 = (((seed + 1) * 9301 + 49297) % 233280) / 233280;
            const pseudoRandom3 = (((seed + 2) * 9301 + 49297) % 233280) / 233280;
            const charCode = 0x30A0 + Math.floor(pseudoRandom1 * 96);

            return (
              <div
                key={i}
                className="absolute text-xs animate-pulse"
                style={{
                  left: `${i * 5}%`,
                  top: `${pseudoRandom2 * 100}%`,
                  animationDelay: `${pseudoRandom3 * 2}s`,
                  animationDuration: `${1 + pseudoRandom1 * 2}s`
                }}
              >
                {String.fromCharCode(charCode)}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 p-6 h-screen flex flex-col">
          {/* Terminal Header */}
          <div className="mb-4 border-b border-green-800 pb-2">
            <div className="flex items-center justify-between">
              <div className="text-green-300">
                <span className="text-white">Solario</span> Boot Terminal v2.1.0
              </div>
              <div className="text-xs text-green-600">
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>

          {/* System Info Panel */}
          {systemInfo && (
            <div className="mb-6 grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-green-300">SYSTEM INFORMATION:</div>
                <div>CPU: {systemInfo.cpu}</div>
                <div>Memory: {systemInfo.memory}</div>
                <div>Storage: {systemInfo.storage}</div>
              </div>
              <div className="space-y-1">
                <div className="text-green-300">NETWORK STATUS:</div>
                <div>Connection: {systemInfo.network}</div>
                <div>Version: {systemInfo.version}</div>
                <div>Uptime: {Math.floor((Date.now() - systemInfo.uptime) / 1000)}s</div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-green-300">BOOT PROGRESS</span>
              <span className="text-xs text-green-300">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Boot Steps Status */}
          <div className="mb-4 grid grid-cols-4 gap-3 text-xs">
            {bootSteps.slice(0, 8).map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  step.status === 'completed'
                    ? 'bg-green-900/40 border-green-500 text-green-300 shadow-lg shadow-green-500/20'
                    : step.status === 'running'
                    ? 'bg-blue-900/40 border-blue-500 text-blue-300 animate-pulse shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/30 border-gray-600 text-gray-500'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-1 rounded ${
                    step.status === 'completed' ? 'bg-green-500/20' :
                    step.status === 'running' ? 'bg-blue-500/20' : 'bg-gray-500/20'
                  }`}>
                    {step.icon}
                  </div>
                  <span className="font-medium truncate">{step.name}</span>
                </div>
                <div className="text-xs opacity-75 mb-1">{step.description}</div>
                <div className="text-xs font-mono text-gray-400">{step.address}</div>
              </div>
            ))}
          </div>

          {/* Terminal Output */}
          <div
            ref={terminalRef}
            className="flex-1 bg-black border border-green-800 rounded p-4 overflow-y-auto font-mono text-sm"
          >
            {terminalOutput.map((line, index) => (
              <div
                key={index}
                className={`${
                  line.includes('[  OK  ]') ? 'text-green-400' :
                  line.includes('[ FAIL ]') ? 'text-red-400' :
                  line.includes('[ WARN ]') ? 'text-yellow-400' :
                  line.includes('[') && line.includes(']') ? 'text-blue-400' :
                  'text-green-300'
                }`}
              >
                {line || '\u00A0'}
              </div>
            ))}
            <div className="flex items-center">
              <span className="text-green-400">root@solario:~# </span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <div className="text-white text-2xl font-bold">S</div>
          </div>
          <p className="text-gray-400">Initializing system components...</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Boot Progress</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Boot Steps */}
        <div className="space-y-3">
          {bootSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
                step.status === 'running'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : step.status === 'completed'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : step.status === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-gray-800/50 border-gray-700 text-gray-500'
              }`}
            >
              <div className="flex-shrink-0">
                {step.status === 'running' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                ) : step.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : step.status === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                <div className="text-sm opacity-75">{step.description}</div>
              </div>

              <div className="flex-shrink-0">
                {step.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        {currentStep < bootSteps.length && (
          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of {bootSteps.length}
            </div>
            <div className="text-lg text-white font-medium mt-1">
              {bootSteps[currentStep]?.name}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-600">
          <p>Solario Desktop Environment v2.0</p>
          <p className="mt-1">© 2025 Solario Systems. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
