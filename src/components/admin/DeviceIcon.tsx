import React from 'react';
import { Smartphone, Laptop, Monitor, Tablet, HardDrive } from 'lucide-react';

interface DeviceIconProps {
  os?: string | null;
  deviceType?: string | null;
  className?: string;
}

// Exact official vector paths from simple-icons
export const AppleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

export const WindowsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.951-1.801" />
  </svg>
);

export const LinuxIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2z" />
  </svg>
);

export const AndroidIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8566 8 12 8s-3.5902.411-5.1368.9497L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
  </svg>
);

export const DeviceIcon: React.FC<DeviceIconProps> = ({ os, deviceType, className = 'w-4 h-4' }) => {
  const normalizedOs = (os || '').toLowerCase();
  const normalizedDevice = (deviceType || '').toLowerCase();

  // 1. macOS & Mac
  if (normalizedOs.includes('mac') || normalizedOs.includes('os x') || normalizedOs.includes('darwin')) {
    return <AppleIcon className={`${className} text-charcoal dark:text-cream`} />;
  }

  // 2. iOS / iPhone / iPad
  if (normalizedOs.includes('ios') || normalizedOs.includes('iphone') || normalizedOs.includes('ipad') || normalizedDevice.includes('ios')) {
    return <AppleIcon className={`${className} text-charcoal dark:text-cream`} />;
  }

  // 3. Windows
  if (normalizedOs.includes('win') || normalizedOs.includes('windows')) {
    return <WindowsIcon className={`${className} text-[#0078D4] dark:text-[#60CDFF]`} />;
  }

  // 4. Linux (Ubuntu, Fedora, Debian, Arch, etc.)
  if (normalizedOs.includes('linux') || normalizedOs.includes('ubuntu') || normalizedOs.includes('fedora') || normalizedOs.includes('debian') || normalizedOs.includes('arch')) {
    return <LinuxIcon className={`${className} text-[#FCC624] dark:text-[#FCC624]`} />;
  }

  // 5. Android
  if (normalizedOs.includes('android') || normalizedDevice.includes('android')) {
    return <AndroidIcon className={`${className} text-[#3DDC84]`} />;
  }

  // 6. Generic Fallbacks by device type
  if (normalizedDevice.includes('mobile') || normalizedDevice.includes('phone')) {
    return <Smartphone className={`${className} text-charcoal-muted dark:text-cream-dim`} />;
  }

  if (normalizedDevice.includes('tablet') || normalizedDevice.includes('ipad')) {
    return <Tablet className={`${className} text-charcoal-muted dark:text-cream-dim`} />;
  }

  if (normalizedDevice.includes('desktop')) {
    return <Monitor className={`${className} text-charcoal-muted dark:text-cream-dim`} />;
  }

  if (normalizedDevice.includes('laptop')) {
    return <Laptop className={`${className} text-charcoal-muted dark:text-cream-dim`} />;
  }

  return <HardDrive className={`${className} text-charcoal-muted dark:text-cream-dim`} />;
};
