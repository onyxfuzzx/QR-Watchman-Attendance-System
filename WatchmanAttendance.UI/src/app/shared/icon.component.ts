import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName =
  | 'location'
  | 'map'
  | 'check'
  | 'x'
  | 'clock'
  | 'user'
  | 'users'
  | 'calendar'
  | 'qr'
  | 'logout'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'eye'
  | 'eye-off'
  | 'search'
  | 'filter'
  | 'download'
  | 'upload'
  | 'refresh'
  | 'spinner'
  | 'shield'
  | 'clipboard'
  | 'building'
  | 'chart'
  | 'bell'
  | 'settings'
  | 'chevron-right'
  | 'chevron-down'
  | 'external-link'
  | 'copy'
  | 'crosshair';

@Component({
  standalone: true,
  selector: 'app-icon',
  imports: [CommonModule],
  template: `
    <svg
      [attr.class]="'icon ' + (className || '')"
      [style.width.px]="size"
      [style.height.px]="size"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ng-container [ngSwitch]="name">
        <!-- Location Pin -->
        <ng-container *ngSwitchCase="'location'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </ng-container>

        <!-- Map -->
        <ng-container *ngSwitchCase="'map'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </ng-container>

        <!-- Check / Tick -->
        <ng-container *ngSwitchCase="'check'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m4.5 12.75 6 6 9-13.5" />
        </ng-container>

        <!-- X / Close -->
        <ng-container *ngSwitchCase="'x'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18 18 6M6 6l12 12" />
        </ng-container>

        <!-- Clock -->
        <ng-container *ngSwitchCase="'clock'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </ng-container>

        <!-- User -->
        <ng-container *ngSwitchCase="'user'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </ng-container>

        <!-- Users -->
        <ng-container *ngSwitchCase="'users'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </ng-container>

        <!-- Calendar -->
        <ng-container *ngSwitchCase="'calendar'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </ng-container>

        <!-- QR Code -->
        <ng-container *ngSwitchCase="'qr'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
        </ng-container>

        <!-- Logout -->
        <ng-container *ngSwitchCase="'logout'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </ng-container>

        <!-- Plus -->
        <ng-container *ngSwitchCase="'plus'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 4.5v15m7.5-7.5h-15" />
        </ng-container>

        <!-- Trash -->
        <ng-container *ngSwitchCase="'trash'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </ng-container>

        <!-- Edit / Pencil -->
        <ng-container *ngSwitchCase="'edit'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </ng-container>

        <!-- Eye -->
        <ng-container *ngSwitchCase="'eye'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </ng-container>

        <!-- Eye Off -->
        <ng-container *ngSwitchCase="'eye-off'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </ng-container>

        <!-- Search -->
        <ng-container *ngSwitchCase="'search'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </ng-container>

        <!-- Filter -->
        <ng-container *ngSwitchCase="'filter'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </ng-container>

        <!-- Download -->
        <ng-container *ngSwitchCase="'download'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </ng-container>

        <!-- Upload -->
        <ng-container *ngSwitchCase="'upload'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </ng-container>

        <!-- Refresh -->
        <ng-container *ngSwitchCase="'refresh'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </ng-container>

        <!-- Spinner -->
        <ng-container *ngSwitchCase="'spinner'">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"
                  fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate"
                              from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
          </circle>
        </ng-container>

        <!-- Shield -->
        <ng-container *ngSwitchCase="'shield'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </ng-container>

        <!-- Clipboard -->
        <ng-container *ngSwitchCase="'clipboard'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </ng-container>

        <!-- Building -->
        <ng-container *ngSwitchCase="'building'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </ng-container>

        <!-- Chart -->
        <ng-container *ngSwitchCase="'chart'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </ng-container>

        <!-- Bell -->
        <ng-container *ngSwitchCase="'bell'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </ng-container>

        <!-- Settings / Cog -->
        <ng-container *ngSwitchCase="'settings'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </ng-container>

        <!-- Chevron Right -->
        <ng-container *ngSwitchCase="'chevron-right'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </ng-container>

        <!-- Chevron Down -->
        <ng-container *ngSwitchCase="'chevron-down'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </ng-container>

        <!-- External Link -->
        <ng-container *ngSwitchCase="'external-link'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </ng-container>

        <!-- Copy -->
        <ng-container *ngSwitchCase="'copy'">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
        </ng-container>

        <!-- Crosshair / Target -->
        <ng-container *ngSwitchCase="'crosshair'">
          <circle cx="12" cy="12" r="10" stroke-width="1.5" fill="none"/>
          <path stroke-linecap="round" stroke-width="1.5" d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          <circle cx="12" cy="12" r="3" stroke-width="1.5" fill="none"/>
        </ng-container>

        <!-- Default fallback -->
        <ng-container *ngSwitchDefault>
          <circle cx="12" cy="12" r="10" stroke-width="1.5" fill="none"/>
        </ng-container>
      </ng-container>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .icon {
      flex-shrink: 0;
    }
  `]
})
export class IconComponent {
  @Input() name!: IconName;
  @Input() size: number = 20;
  @Input() className?: string;
  @Input() fill: string = 'none';
  @Input() stroke: string = 'currentColor';
}
