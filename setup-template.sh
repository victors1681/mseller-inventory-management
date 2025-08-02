#!/bin/bash

# MSeller Inventory Management Template Setup Script
# This script helps you set up the template for a new project

echo "🚀 MSeller Template Setup"
echo "========================="

# Get project details from user
read -p "Enter your new project name: " PROJECT_NAME
read -p "Enter your project description: " PROJECT_DESCRIPTION
read -p "Enter your package identifier (e.g., com.yourcompany.yourapp): " PACKAGE_ID
read -p "Enter your Expo slug (lowercase, no spaces): " EXPO_SLUG

echo ""
echo "📝 Updating project configuration..."

# Update package.json
sed -i.bak "s/\"mseller-inventory-management\"/\"$PROJECT_NAME\"/g" package.json
sed -i.bak "s/\"MSeller Inventory Management with Firebase\"/\"$PROJECT_DESCRIPTION\"/g" package.json

# Update app.json
sed -i.bak "s/\"MSeller Inventory Management\"/\"$PROJECT_NAME\"/g" app.json
sed -i.bak "s/\"mseller-inventory-management\"/\"$EXPO_SLUG\"/g" app.json
sed -i.bak "s/\"com.victors1681.msellerinventorymanagement\"/\"$PACKAGE_ID\"/g" app.json

# Create .env from template
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Don't forget to update .env with your Firebase configuration!"
fi

# Remove backup files
rm -f package.json.bak app.json.bak

echo ""
echo "✅ Template setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your Firebase configuration"
echo "2. Create a Firebase project at https://console.firebase.google.com"
echo "3. Enable Authentication with Email/Password"
echo "4. Update translation files in locales/ folder"
echo "5. Customize colors and theme in constants/ folder"
echo "6. Run 'npm start' to begin development"
echo ""
echo "📚 See TEMPLATE_README.md for detailed setup instructions"
echo ""
echo "Happy coding! 🎉"
