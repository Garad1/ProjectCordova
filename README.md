Pour exécuter notre application sur Android :

- cordova platform add android
- cordova run android

Pour exécuter notre application sur iOS :

- cordova platform add ios
- cordova run ios

Si android et gradle sont dejà installés sur la machine, créer un fichier .bash_profile et ajouter la ligne suivante :

- export PATH=${PATH}:~/Android/Sdk/platform-tools:~/Android/Sdk/tools:~/.gradle/wrapper/dists/gradle-3.3-all/55gk2rcmfc6p2dg9u9ohc3hw9/gradle-3.3/bin/
- (Path/To/Android/Sdk/platform-tools:~Path/To/Android/Sdk/tools:Path/To/.gradle)

Nous ne connaissons pas comment faire sur windows car nous avons exclusivement travaillé sur Linux et MacOS.

Voici les différents plugins à ajouter pour que l'application soit fonctionnelle :

cordova plugin add cordova-plugin-badge
cordova plugin add cordova-plugin-local-notification (Si ça fonctionne pas) cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications.git
cordova plugin add cordova.plugins.diagnostic
cordova plugin add cordova-plugin-background-mode
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-geolocation
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-whitelist

A chaque nouveau terminal, il faut exécuter la commande suivante avant de run :
source .bash_profile