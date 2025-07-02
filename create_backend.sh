#!/bin/zsh

# Create the directory structure
mkdir -p dzikwa-backend/{config,controllers,models,routes,middlewares,public/uploads}

# Create all the files
touch dzikwa-backend/config/{db.js,config.js}
touch dzikwa-backend/controllers/{authController.js,donationController.js,volunteerController.js,partnerController.js,childController.js}
touch dzikwa-backend/models/{User.js,Donation.js,Volunteer.js,Partner.js,Child.js}
touch dzikwa-backend/routes/{authRoutes.js,donationRoutes.js,volunteerRoutes.js,partnerRoutes.js,childRoutes.js}
touch dzikwa-backend/middlewares/auth.js
touch dzikwa-backend/{.env,server.js,package.json}

# Display the structure
echo "\nDirectory structure created:\n"
find dzikwa-backend -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'

echo "\nDone! Backend structure created in 'dzikwa-backend' directory."
