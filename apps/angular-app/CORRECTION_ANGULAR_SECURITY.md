# Correction de l'erreur Angular NG0904 - Sécurité des URLs

## Problème rencontré

```
ERROR RuntimeError: NG0904: unsafe value used in a resource URL context (see https://g.co/ng/security#xss)
```

Cette erreur se produisait lors de l'utilisation d'une URL dynamique dans l'attribut `[src]` d'une balise `<iframe>` sans validation de sécurité Angular.

## Solution implémentée

### 1. Modification du composant `TaskFormComponent`

**Fichier :** `apps/angular-app/src/app/modules/demand/task-form.component.ts`

#### Changements apportés :

1. **Import ajouté :**
   ```typescript
   import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
   ```

2. **Nouvelle propriété :**
   ```typescript
   safeFormUrl: SafeResourceUrl = '';
   ```

3. **Méthode `loadForm()` modifiée :**
   ```typescript
   async loadForm() {
     if (!this.containerId || !this.taskId) {
       return;
     }

     this.isLoading = true;
     this.errorMsg = '';
     try {
       // Construit l'URL directe du formulaire HTML jBPM pour l'iframe
       this.formUrl = `http://localhost:8080/kie-server/services/rest/server/containers/${this.containerId}/forms/tasks/${this.taskId}/content`;
       
       // Sanitize l'URL pour Angular
       this.safeFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.formUrl);
       
       console.log('Task form URL:', this.formUrl);
       this.isLoading = false;
     } catch (err: any) {
       this.errorMsg = 'Erreur lors du chargement de l\'URL du formulaire HTML : ' + (err.message || err);
       this.isLoading = false;
       console.error('Erreur loadForm:', err);
     }
   }
   ```

4. **Interface `OnChanges` ajoutée :**
   ```typescript
   export class TaskFormComponent implements OnInit, OnChanges {
     // ...
     ngOnChanges(changes: SimpleChanges): void {
       // Recharger le formulaire si containerId ou taskId changent
       if ((changes['containerId'] || changes['taskId']) && this.containerId && this.taskId) {
         this.loadForm();
       }
     }
   }
   ```

### 2. Modification du template HTML

**Fichier :** `apps/angular-app/src/app/modules/demand/task-form.component.html`

#### Changements apportés :

1. **Utilisation de `safeFormUrl` au lieu de `formUrl` :**
   ```html
   <iframe [src]="safeFormUrl" width="100%" height="700px" frameborder="0" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px;" title="Formulaire de tâche jBPM">
   </iframe>
   ```

2. **Amélioration de l'interface utilisateur :**
   - Ajout d'indicateurs de chargement
   - Meilleure gestion des erreurs
   - Affichage de l'URL du formulaire pour le debug
   - Styles améliorés avec Tailwind CSS

## Explication technique

### Pourquoi cette erreur se produisait-elle ?

Angular applique par défaut une politique de sécurité stricte pour éviter les attaques XSS (Cross-Site Scripting). Lorsqu'une URL dynamique est utilisée dans un contexte sensible comme l'attribut `[src]` d'une iframe, Angular exige que cette URL soit explicitement validée comme sûre.

### Comment `DomSanitizer` résout le problème

Le service `DomSanitizer` d'Angular fournit des méthodes pour indiquer explicitement qu'une valeur est sûre :

- `bypassSecurityTrustResourceUrl()` : Pour les URLs de ressources (iframe, script, etc.)
- `bypassSecurityTrustHtml()` : Pour le contenu HTML
- `bypassSecurityTrustStyle()` : Pour les styles CSS
- `bypassSecurityTrustScript()` : Pour les scripts JavaScript

### Sécurité

⚠️ **Attention :** `bypassSecurityTrustResourceUrl()` doit être utilisé uniquement avec des URLs que vous contrôlez et en qui vous avez confiance. Dans notre cas, c'est sûr car l'URL pointe vers notre backend jBPM contrôlé.

## Tests recommandés

1. **Test de compilation :**
   ```bash
   npm run build
   ```

2. **Test en développement :**
   ```bash
   npm start
   ```

3. **Vérifications à effectuer :**
   - L'erreur NG0904 ne doit plus apparaître dans la console
   - Le formulaire jBPM doit s'afficher correctement dans l'iframe
   - Les changements de `containerId` et `taskId` doivent recharger le formulaire
   - Les erreurs de chargement doivent être affichées clairement

## Ressources

- [Documentation officielle Angular - DomSanitizer](https://angular.io/api/platform-browser/DomSanitizer)
- [Guide de sécurité Angular](https://g.co/ng/security#xss)
- [Explication de l'erreur NG0904](https://g.co/ng/security#xss)

## Notes importantes

- Cette solution reproduit le comportement de jbpmPortal en affichant le formulaire HTML natif dans une iframe
- L'interactivité du formulaire dépend de l'accès au backend jBPM (authentification, CORS, etc.)
- Pour une solution plus robuste à long terme, considérez la génération dynamique de formulaires Angular à partir des variables d'entrée de la tâche 