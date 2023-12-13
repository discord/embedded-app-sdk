# Application Shelf

## Overview

The application shelf is where users can see activities that can be played. It has multiple components with varying specifications.

![application-shelf](/docs/assets/application-shelf.png)

Your application has multiple different components that can be configured. There are two views of an application shelf tile.
The regular size tile (2-up tile) and the larger "featured" application tile (1-up tile).

|                 1-up Tile                  |                 2-up Tile                  |
| :----------------------------------------: | :----------------------------------------: |
| ![1-up-tile](/docs/assets/one-up-tile.png) | ![2-up-tile](/docs/assets/two-up-tile.png) |

## Cover Image

The cover image is displayed when not hovering over the Application Shelf Item. If no image is configured, a fallback image will be used.

### Specifications

- 16/9 aspect ratio and at least 1024px wide

### Where to configure

- Discord Developer Portal under **Embedded Application → Art Assets**.

## Preview Video

Hovering over the cover image should start playing a preview video of the Application. The preview videos should be no more than 10 seconds long. If no video is provided, nothing will happen as you hover over the application.

### Specifications

- 640 x 360
- mp4
- under 10s long
- under 1 MB

### Where to configure

- Discord Developer Portal under **Embedded Application → Art Assets**.

## Application Name

The application name is the application name.

### Where to configure

- Discord Developer Portal under **General Information** (name field)

## Application Description

The description is only shown for the 1-up view of the Application Shelf Item.

### Where to configure

- Discord Developer Portal under **General Information** (tags field)

## Max Participants

The max participants indicate the maximum number of players for your application. This is displayed above the name in the 1-up view (Up to X participants). Leaving this field empty defaults to ‘Unlimited participants’). It is also displayed under the name in the 2-up view.

### Where to configure

- Discord Developer Portal under **General Information** (max participants field)
