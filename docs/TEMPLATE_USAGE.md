# How to Use This Project as a Template

This guide explains different ways to use this project as a template for new React Native projects.

## Method 1: GitHub Template Repository (Recommended)

### Step 1: Make This Repository a Template

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Template repository" section
4. Check the "Template repository" checkbox
5. Click "Save"

### Step 2: Use the Template

1. Go to the repository page on GitHub
2. Click the green "Use this template" button
3. Choose "Create a new repository"
4. Fill in your new repository details:
   - Repository name
   - Description
   - Public/Private setting
5. Click "Create repository from template"

### Step 3: Set Up Your New Project

```bash
# Clone your new repository
git clone https://github.com/yourusername/your-new-project.git
cd your-new-project

# Run the setup script
./setup-template.sh

# Install dependencies
npm install

# Start development
npm start
```

## Method 2: Manual Clone and Customize

### Step 1: Clone This Repository

```bash
git clone https://github.com/victors1681/mseller-inventory-management.git your-new-project
cd your-new-project
```

### Step 2: Remove Git History and Initialize New Repo

```bash
# Remove existing git history
rm -rf .git

# Initialize new git repository
git init
git add .
git commit -m "Initial commit from MSeller template"

# Add your remote repository
git remote add origin https://github.com/yourusername/your-new-project.git
git push -u origin main
```

### Step 3: Customize the Project

```bash
# Run setup script
./setup-template.sh

# Or manually update project details
# - Update package.json
# - Update app.json
# - Update .env file
```

## Method 3: Fork and Customize

### Step 1: Fork the Repository

1. Go to the repository on GitHub
2. Click "Fork" button
3. Choose your account/organization
4. Wait for the fork to complete

### Step 2: Clone Your Fork

```bash
git clone https://github.com/yourusername/mseller-inventory-management.git
cd mseller-inventory-management
```

### Step 3: Customize for Your Project

```bash
# Create a new branch for your customizations
git checkout -b customize-for-my-project

# Run setup script
./setup-template.sh

# Make your customizations
# Commit changes
git add .
git commit -m "Customize template for my project"
git push origin customize-for-my-project
```

## Method 4: Download and Set Up Manually

### Step 1: Download the Code

1. Go to the repository on GitHub
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file to your desired location

### Step 2: Set Up New Git Repository

```bash
cd your-extracted-folder

# Initialize git
git init
git add .
git commit -m "Initial commit from MSeller template"

# Connect to your remote repository
git remote add origin https://github.com/yourusername/your-new-project.git
git push -u origin main
```

## Post-Setup Customization

Regardless of which method you use, follow these steps after setup:

### 1. Firebase Configuration

1. Create a new Firebase project
2. Enable Authentication with Email/Password
3. Copy configuration to `.env` file
4. (Optional) Set up Firebase Functions

### 2. Project Customization

Use the `TEMPLATE_CHECKLIST.md` file to guide your customization:

- [ ] Update project details in `package.json` and `app.json`
- [ ] Customize translations in `locales/` folder
- [ ] Update colors and theme in `constants/` folder
- [ ] Modify user types in `types/user.ts`
- [ ] Update API configuration in `services/`

### 3. Remove Template Files (Optional)

After customization, you may want to remove template-specific files:

```bash
# Remove template documentation
rm TEMPLATE_README.md
rm TEMPLATE_CHECKLIST.md
rm TEMPLATE_USAGE.md
rm setup-template.sh

# Remove GitHub template configuration
rm -rf .github/template.yml

# Update README.md with your project information
mv README.md OLD_README.md
# Create your own README.md
```

## Best Practices for Template Usage

### 1. Version Control Strategy

- Create a `template` branch to track template updates
- Use feature branches for customizations
- Regularly merge template updates into your project

### 2. Environment Management

- Never commit `.env` files with real credentials
- Use different Firebase projects for dev/staging/production
- Set up environment-specific configurations

### 3. Documentation

- Keep the `TEMPLATE_CHECKLIST.md` until fully customized
- Document your customizations
- Update README.md with project-specific information

### 4. Testing

- Test the template setup process regularly
- Validate all features work after customization
- Test on both iOS and Android platforms

## Template Maintenance

### Keeping Templates Updated

If you're maintaining this as a template:

1. **Regular Updates**: Keep dependencies updated
2. **Feature Additions**: Add new features that benefit all projects
3. **Bug Fixes**: Fix issues and push to template
4. **Documentation**: Keep template documentation current

### Syncing Template Changes

For projects using the template:

```bash
# Add template as upstream remote
git remote add template https://github.com/victors1681/mseller-inventory-management.git

# Fetch template updates
git fetch template

# Merge specific updates (be careful with conflicts)
git merge template/main --allow-unrelated-histories
```

## Troubleshooting

### Common Issues

1. **Dependencies not installing**: Check Node.js version compatibility
2. **Firebase errors**: Verify `.env` configuration
3. **Build failures**: Check TypeScript and ESLint errors
4. **Template conflicts**: Resolve merge conflicts carefully

### Getting Help

1. Check `TEMPLATE_CHECKLIST.md` for setup steps
2. Review Firebase and Expo documentation
3. Create issues in the template repository
4. Join React Native and Expo communities

## Contributing Back to Template

If you make improvements that would benefit all users:

1. Fork the original template repository
2. Create a feature branch
3. Make your improvements
4. Test thoroughly
5. Submit a pull request

---

## Quick Start Summary

```bash
# Method 1: Use GitHub template (recommended)
# Click "Use this template" on GitHub

# Method 2: Clone and customize
git clone <template-repo> <your-project>
cd <your-project>
./setup-template.sh
npm install
npm start
```

Choose the method that best fits your workflow and project requirements!
