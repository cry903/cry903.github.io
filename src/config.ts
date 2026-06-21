export const SITE_CONFIG = {
  name: 'Layla',
  fullName: 'Layla',
  subtitle: '沟水相逢，尽是他乡之客',
  bio: '热爱技术与创作，记录学习路上的点点滴滴。欢迎来到我的个人主页！',
  avatar: '/avatar.svg',
} as const;

export const SKILLS: string[] = [
  'C++',
  'Python',
  'Qt',
  'OpenCV',
  'HTML/CSS',
  'Git',
];

export const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    url: 'https://github.com/cry903',
    icon: 'github',
  },
  {
    label: 'Email',
    url: 'mailto:layla@lay1a.me',
    icon: 'email',
  },
] as const;
