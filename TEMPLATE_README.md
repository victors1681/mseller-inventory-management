# MSeller Inventory Management - Project Template

This is a React Native Expo template with Firebase Authentication, internationalization (i18n), and comprehensive API integration.

## Features

### 🔐 Authentication System
- Firebase Authentication with email/password
- User context management with loading states
- Protected routes and screens
- Password reset functionality
- User profile management

### 🌍 Internationalization (i18n)
- Multi-language support (English/Spanish)
- React-i18next integration
- Language selector component
- Device locale detection
- Type-safe translation keys

### 🎨 UI/UX
- Material Design 3 with react-native-paper
- Custom theming with light/dark mode support
- Responsive design patterns
- Loading states and error handling

### 🔗 API Integration
- Axios HTTP client with automatic token management
- Firebase Functions integration
- Request/response interceptors
- Automatic token refresh
- Environment-based URL configuration

### 📱 Project Structure
- Clean architecture with contexts, services, and components
- TypeScript throughout
- ESLint configuration
- Comprehensive error handling

## Quick Start

### 1. Use as GitHub Template

1. Go to this repository on GitHub
2. Click "Use this template" button
3. Create your new repository
4. Clone your new repository

### 2. Setup New Project

```bash
# Clone your new repository
git clone https://github.com/yourusername/your-new-project.git
cd your-new-project

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Firebase configuration

# Start development server
npm start
```

### 3. Configure Firebase

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password
3. Create Firebase Functions (optional)
4. Update your `.env` file with Firebase configuration

### 4. Customize for Your Project

1. **Update project name and identifiers:**
   - `package.json` - name, description
   - `app.json` - name, slug, package names
   - `README.md` - project description

2. **Update translation files:**
   - `locales/en.json` - English translations
   - `locales/es.json` - Spanish translations
   - Add more languages as needed

3. **Customize themes:**
   - `constants/Theme.ts` - colors and styling
   - `constants/Colors.ts` - color definitions

4. **Update API configuration:**
   - `services/api.ts` - base URLs and endpoints
   - `services/userService.ts` - Firebase Functions
   - `types/user.ts` - user and business types

## Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Optional: Analytics
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── auth/             # Authentication screens
│   ├── common/           # Common UI components
│   └── ui/               # Base UI components
├── config/               # Configuration files
│   ├── firebase.ts       # Firebase setup
│   └── i18n.ts          # Internationalization
├── constants/            # App constants
│   ├── Colors.ts         # Color definitions
│   └── Theme.ts          # Theme configuration
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── UserContext.tsx   # User profile state
├── hooks/                # Custom hooks
│   └── useTranslation.ts # Translation utilities
├── locales/              # Translation files
│   ├── en.json          # English translations
│   └── es.json          # Spanish translations
├── services/             # API and services
│   ├── api.ts           # HTTP client
│   └── userService.ts   # User management
├── types/                # TypeScript definitions
│   └── user.ts          # User and business types
└── assets/              # Static assets
```

## Customization Guide

### Adding a New Language

1. Create translation file: `locales/[language].json`
2. Update `config/i18n.ts` to include new language
3. Add language to `hooks/useTranslation.ts` AVAILABLE_LANGUAGES

### Adding New Authentication Providers

1. Enable provider in Firebase Console
2. Update `components/auth/` screens
3. Add provider-specific error handling

### Customizing the Theme

1. Update colors in `constants/Colors.ts`
2. Modify theme in `constants/Theme.ts`
3. Update component styles as needed

### Adding New API Endpoints

1. Define types in `types/`
2. Add service functions in `services/`
3. Create UI components in `components/`

## Deployment

### Mobile App Deployment

```bash
# Build for production
npx expo build:android
npx expo build:ios

# Or use EAS Build
npx eas build --platform all
```

### Firebase Functions Deployment

```bash
# Deploy Firebase Functions
firebase deploy --only functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions and support:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the API integration guide

---

**Made with ❤️ using React Native, Expo, and Firebase**
