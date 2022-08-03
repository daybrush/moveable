# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.34.3](https://github.com/daybrush/moveable/compare/0.34.2...0.34.3) (2022-08-03)
### :sparkles: Packages
* `lit-moveable` 0.11.3
* `moveable` 0.34.3
* `preact-moveable` 0.36.3
* `react-compat-moveable` 0.22.3
* `react-moveable` 0.37.3
* `svelte-moveable` 0.26.3
* `vue-moveable` 2.0.0-beta.31
* `vue3-moveable` 0.9.3
* `ngx-moveable` 0.31.3


### :bug: Bug Fix

* `react-moveable`, `react-compat-moveable`
    * fix click event by gesto update #713 ([3a3c762](https://github.com/daybrush/moveable/commit/3a3c762fc20cf682c3d8fda21f28244a3ecf36bd))
* `react-moveable`
    * fix offsetParent with willChange #711 ([cd1de86](https://github.com/daybrush/moveable/commit/cd1de864191fc39b04065ada89d6e600f02ad0a1))


### :mega: Other

* All
    * publish packages ([5468ff7](https://github.com/daybrush/moveable/commit/5468ff763bfa3f30e637ce8f504af09152b22c5c))
* Other
    * fix angular type script ([4f04200](https://github.com/daybrush/moveable/commit/4f042003a31ae6ff13936ab6e64cdfc8a91e3125))
    * Update FUNDING.yml ([4cd7af1](https://github.com/daybrush/moveable/commit/4cd7af1096bbd23244b62db744fb6a92deb03165))



## [0.34.2](https://github.com/daybrush/moveable/compare/0.33.0...0.34.2) (2022-08-01)
### :sparkles: Packages
* `lit-moveable` 0.11.2
* `moveable` 0.34.2
* `preact-moveable` 0.36.2
* `react-compat-moveable` 0.22.2
* `react-moveable` 0.37.2
* `svelte-moveable` 0.26.2
* `vue-moveable` 2.0.0-beta.30
* `vue3-moveable` 0.9.2
* `ngx-moveable` 0.31.2


### :rocket: New Features

* `react-moveable`, `react-compat-moveable`
    * add preventClickEventOnDrag prop ([281b2b7](https://github.com/daybrush/moveable/commit/281b2b7aa5dba3bdc4c3f478e115a0de8fd2359e))
* `react-moveable`
    * add CSSObject on render ([e2f462a](https://github.com/daybrush/moveable/commit/e2f462aecd10d076ef874a6ba2af97a2e59841d1))
    * add maxSnapElementGuidelineDistance #707 ([171b027](https://github.com/daybrush/moveable/commit/171b02708e6343656655cf403744e1a0fbfa2324))
    * add startFixedDirection property on before event ([c838c9c](https://github.com/daybrush/moveable/commit/c838c9cc13305eb10ba85b75bcfcd7daa52047f1))
    * add stopPropagation prop ([3ce54e0](https://github.com/daybrush/moveable/commit/3ce54e09972962f69f2b697dc52e0b507b2aad9a))


### :bug: Bug Fix

* `react-moveable`
    * fix cssText, style on drag ([aed807e](https://github.com/daybrush/moveable/commit/aed807ef7a04b25101cef8fbad38d94a1e7482ff))
    * fix drag undefined on Rotate Group #710 ([db80e7d](https://github.com/daybrush/moveable/commit/db80e7d92bee3be684c74a9cb20bc62680f4e0a4))
    * fix getElementInfo's NaN type value #709 ([e99d94f](https://github.com/daybrush/moveable/commit/e99d94f5c3302fd3c851aa942e99daa75346479c))
    * fix rotate position #710 ([d269d1f](https://github.com/daybrush/moveable/commit/d269d1f3c095a0930359597d894d3cdb631b3ee2))


### :memo: Documentation

* `react-moveable`, `moveable`
    * fix README ([5ded1c1](https://github.com/daybrush/moveable/commit/5ded1c19b77fe2c3974bcf1f1ac1356d2924991d))


### :mega: Other

* All
    * publish packages ([0076577](https://github.com/daybrush/moveable/commit/00765776ba92b5ca691c1aefd1c20687952373d9))
    * publish packages ([ffa0c18](https://github.com/daybrush/moveable/commit/ffa0c18bb6970d6f8d88a49db23b11620e704618))
    * publish packages ([958ebac](https://github.com/daybrush/moveable/commit/958ebace6032eafb17f1ce366394b440671b45b3))



## [0.33.0](https://github.com/daybrush/moveable/compare/0.32.0...0.33.0) (2022-07-25)
### :sparkles: Packages
* `lit-moveable` 0.10.0
* `moveable` 0.33.0
* `preact-moveable` 0.35.0
* `react-compat-moveable` 0.21.0
* `react-moveable` 0.36.0
* `svelte-moveable` 0.25.0
* `vue-moveable` 2.0.0-beta.27
* `vue3-moveable` 0.8.0
* `ngx-moveable` 0.30.0


### :rocket: New Features

* `react-moveable`
    * add `cssText`, `style` property on events ([7a9012e](https://github.com/daybrush/moveable/commit/7a9012e4fcdc9a37bb2096bcf37e8e4d25310a8b))
    * add `rotateAroundControls` prop ([d473ffa](https://github.com/daybrush/moveable/commit/d473ffa76a5c390945c320ee8ee8b6f671a0fbed))
    * add style, cssText, afterTransform properties ([68b4a92](https://github.com/daybrush/moveable/commit/68b4a925b75f599924628425b4da5cfd5424ad71))
    * support pos guideline info #707 ([1cd1b81](https://github.com/daybrush/moveable/commit/1cd1b8134419df88b16ffb9aaa412ebb9048b379))
    * Support rotate and resize together #467 ([24482a6](https://github.com/daybrush/moveable/commit/24482a68ac2611507e2fa9e6673f969bc1c65cff))
    * use edge at the same tiem #706 ([c273703](https://github.com/daybrush/moveable/commit/c273703e5b62ea41ec9df441158a77cb0bf835c1))


### :bug: Bug Fix

* `vue3-moveable`, `vue-moveable`, `react-moveable`
    * remove wrong react types #703 ([25dced4](https://github.com/daybrush/moveable/commit/25dced4f1531cc46d77601f71674031aa58fdf0b))


### :memo: Documentation

* `vue3-moveable`
    * Update Vue3-moveable code example (#704) ([21c7629](https://github.com/daybrush/moveable/commit/21c76295808454d158a36fb74028b3dbe7b3466f))


### :mega: Other

* All
    * publish packages ([63e03d1](https://github.com/daybrush/moveable/commit/63e03d1d5f69e56c7df6d357c58d7acd06932e80))
* `react-moveable`, `react-compat-moveable`
    * update dragscroll module version ([e9b5864](https://github.com/daybrush/moveable/commit/e9b5864c83853578c4190e792543019e30b017eb))



## [0.32.0](https://github.com/daybrush/moveable/compare/0.31.2...0.32.0) (2022-07-21)
### :sparkles: Packages
* `lit-moveable` 0.9.0
* `moveable` 0.32.0
* `preact-moveable` 0.34.0
* `react-compat-moveable` 0.20.0
* `react-moveable` 0.35.0
* `svelte-moveable` 0.24.0
* `vue-moveable` 2.0.0-beta.26
* `vue3-moveable` 0.7.0
* `ngx-moveable` 0.29.0


### :rocket: New Features

* `react-moveable`
    * add `keepRatioFinally` prop #698 ([bf29635](https://github.com/daybrush/moveable/commit/bf29635ab8a160c9e938213b2477cfec73e8401d))
    * add move cursor style with edgeDraggable #703 ([9901deb](https://github.com/daybrush/moveable/commit/9901deb3dd51f449edcd75e4f147b9fa671d951e))
    * support object self type #701 ([99967c2](https://github.com/daybrush/moveable/commit/99967c28f9f0f09ef1891ea1ece4b16a6c10ef43))


### :bug: Bug Fix

* `vue3-moveable`, `vue-moveable`
    * fix files field in package.json #700 ([5130109](https://github.com/daybrush/moveable/commit/51301099b5a9a9764500c09ce61e4bf65c7c60ef))
* `react-moveable`
    * calculate size more accurately #698 ([4dd4038](https://github.com/daybrush/moveable/commit/4dd4038c82c9dff272226e3911549249743dff50))
    * enhance bounds accuracy #699 ([9aee6bd](https://github.com/daybrush/moveable/commit/9aee6bdf0cd9105ef3ef653e18363e21ad4c4b3f))
    * support shadow root #684 ([8502d07](https://github.com/daybrush/moveable/commit/8502d0795c903e7894d0fad9a6a130cbc543f301))


### :mega: Other

* All
    * publish packages ([da24696](https://github.com/daybrush/moveable/commit/da24696977c24b6ea54a433192d15bb7ecbc62e9))
* `vue3-moveable`, `react-moveable`, `react-compat-moveable`, `moveable`
    * update `react-compat-moveable` ([712ae6f](https://github.com/daybrush/moveable/commit/712ae6fb49dec3f4e40a3cd664f63625d7cd5669))



## [0.31.2](https://github.com/daybrush/moveable/compare/0.31.0...0.31.2) (2022-07-17)
### :sparkles: Packages
* `lit-moveable` 0.8.2
* `moveable` 0.31.2
* `preact-moveable` 0.33.2
* `react-compat-moveable` 0.19.2
* `react-moveable` 0.34.2
* `svelte-moveable` 0.23.2
* `vue-moveable` 2.0.0-beta.24
* `vue3-moveable` 0.6.2
* `ngx-moveable` 0.28.2


### :bug: Bug Fix

* All
    * fix files field in package.json #700 ([48ce548](https://github.com/daybrush/moveable/commit/48ce548438dd0a7da9f544730b2fc3ab65073775))


### :mega: Other

* All
    * publish packages ([5d89af5](https://github.com/daybrush/moveable/commit/5d89af521d1a288d4d9ca7923e0e9654e8f97d53))



## [0.31.0](https://github.com/daybrush/moveable/compare/0.30.0...0.31.0) (2022-07-17)
### :sparkles: Packages
* `lit-moveable` 0.8.0
* `moveable` 0.31.0
* `preact-moveable` 0.33.0
* `react-compat-moveable` 0.19.0
* `react-moveable` 0.34.0
* `svelte-moveable` 0.23.0
* `vue-moveable` 2.0.0-beta.22
* `vue3-moveable` 0.6.0
* `ngx-moveable` 0.28.0


### :rocket: New Features

* `react-moveable`
    * add hideChildMoveableDefaultLines prop #692 ([c691403](https://github.com/daybrush/moveable/commit/c6914031e75712eef6a574d6aaf04645535f59d3))
    * add setFixedDirection on rotateStart #670 ([093d0b1](https://github.com/daybrush/moveable/commit/093d0b1303c9742a79f73071470ec73306ff2de6))
    * support edge prop's object type #695 ([699997d](https://github.com/daybrush/moveable/commit/699997d7426110cb199094cd7ac56682723d1cae))
* Other
    * add Snappable ([c7bbd98](https://github.com/daybrush/moveable/commit/c7bbd98393f1e8f45219a5dab9e1337187366ab5))


### :bug: Bug Fix

* `svelte-moveable`, `react-moveable`, `react-compat-moveable`, `lit-moveable`
    * fix floating point for min limit size ([766561c](https://github.com/daybrush/moveable/commit/766561c0e785098720c5a0ae6d9da1e2d9d7b879))
* `svelte-moveable`
    * change dependencies #680 ([7c01017](https://github.com/daybrush/moveable/commit/7c010170642f68b2ec52cf0ea8e2b569fcd2b634))
* `react-moveable`
    * fix guidelines for edgeDraggable #694 ([80f2b44](https://github.com/daybrush/moveable/commit/80f2b44643a0d804df6a65f72583c4d7f6d8ddf7))
    * fix safari 15 consts ([a140e5b](https://github.com/daybrush/moveable/commit/a140e5b77f623973cf6d27d0ff8ab12e63901004))
    * fix transform behavior in safari 15 #696 ([eb0a71c](https://github.com/daybrush/moveable/commit/eb0a71cb8aa11c100a3cf2f85e007d6fdb45a2d7))
    * stop propagation for click control #690 ([1a8f697](https://github.com/daybrush/moveable/commit/1a8f6978ba267632282049b61753bc062d69266f))


### :memo: Documentation

* `react-moveable`
    * add hideChildMoveableDefaultLines docs ([9e02faa](https://github.com/daybrush/moveable/commit/9e02faa5cbd4f5e529a1a58647afd519b0672d3b))
    * fix typo #685 ([c591b1d](https://github.com/daybrush/moveable/commit/c591b1d8a410a3fa6115fcec51ae21d4027aeaa7))


### :mega: Other

* All
    * publish packages ([2a4940f](https://github.com/daybrush/moveable/commit/2a4940f74997fae24c7d77c553a6bc6be1301d40))
* `react-moveable`, `react-compat-moveable`
    * update overlap-area ([be8c4dc](https://github.com/daybrush/moveable/commit/be8c4dc19dbd6d6d7f782c73272cb9878ca21982))



## [0.30.0](https://github.com/daybrush/moveable/compare/0.29.9...0.30.0) (2022-06-09)
### :sparkles: Packages
* `lit-moveable` 0.7.0
* `moveable` 0.30.0
* `preact-moveable` 0.32.0
* `react-compat-moveable` 0.18.0
* `react-moveable` 0.33.0
* `svelte-moveable` 0.22.0
* `vue-moveable` 2.0.0-beta.21
* `vue3-moveable` 0.5.0
* `ngx-moveable` 0.27.0


### :rocket: New Features

* `react-moveable`, `lit-moveable`
    * add snap direction foramt (#669) ([52406cc](https://github.com/daybrush/moveable/commit/52406cc8c2a77dc2446dc935681aa9885661b77b))
* `react-moveable`
    * add `preventClickDefault` option #671 ([17da69f](https://github.com/daybrush/moveable/commit/17da69ff71c6abe4788603dc729b6bc9dd8f27bc))
    * add flushSync prop #668 ([068c174](https://github.com/daybrush/moveable/commit/068c174706338f3eedfa3c93beb967b7399e6daa))


### :bug: Bug Fix

* `react-moveable`, `react-compat-moveable`, `moveable`
    * prevent wheel drag #674 ([e9bea04](https://github.com/daybrush/moveable/commit/e9bea04aec00bd3a2a06918b539c9b02b2a589d5))
* `react-moveable`
    * fix groups' setMin, setMax and ratio ([0e2abf1](https://github.com/daybrush/moveable/commit/0e2abf1ae8504334a7118b9e2b6e9cab9c90c91b))
    * remove peerDependencies ([0aa9869](https://github.com/daybrush/moveable/commit/0aa986952e096cd75def5e0afe9c9b1ac9d4216e))


### :mega: Other

* All
    * publish packages ([b432247](https://github.com/daybrush/moveable/commit/b4322470bcd3bb05fc67d2c89eedd737f8b4b67a))



## [0.29.9](https://github.com/daybrush/moveable/compare/0.29.8...0.29.9) (2022-06-07)
### :sparkles: Packages
* `lit-moveable` 0.6.9
* `moveable` 0.29.9
* `preact-moveable` 0.31.9
* `react-compat-moveable` 0.17.9
* `react-moveable` 0.32.9
* `svelte-moveable` 0.21.9
* `vue-moveable` 2.0.0-beta.20
* `vue3-moveable` 0.4.9
* `ngx-moveable` 0.26.9


### :rocket: New Features

* `vue-moveable`, `react-moveable`
    * add clippable keepRatio ([37da849](https://github.com/daybrush/moveable/commit/37da849e81454ea17be4510a81beeef852cfda9f))
* Other
    * add snappable package ([aec29c6](https://github.com/daybrush/moveable/commit/aec29c67d8314b9ede95e4320ff29d6c0dac87eb))


### :bug: Bug Fix

* `react-moveable`, `react-compat-moveable`, `lit-moveable`
    * fix minSize for zero size ([c34f298](https://github.com/daybrush/moveable/commit/c34f29803a487098f36f45991ea6dff03bd2750a))
* `vue3-moveable`, `vue-moveable`
    * fix commonjs import bug #650 ([15403ce](https://github.com/daybrush/moveable/commit/15403cee70d3f4bf0b9e1311d3bc3086742d7090))
    * fix vue methods' return value ([cc0cb79](https://github.com/daybrush/moveable/commit/cc0cb7981e90c3973763c4fdde2c9cb03168a300))
* `react-moveable`
    * fix [1, 1] direction's bounds #624 ([5108bc3](https://github.com/daybrush/moveable/commit/5108bc33cf9e098cd051e4b7d63b2ac3dc06bf09))
    * fix changed target getos #657 ([54ef5a0](https://github.com/daybrush/moveable/commit/54ef5a03a781e706293699d1ae25141e215044c9))
    * fix clippable bounds #659 ([b3986de](https://github.com/daybrush/moveable/commit/b3986de338b2d38e42288c9d2cafe2a2a7da7705))
    * fix group drag condition ([35c194a](https://github.com/daybrush/moveable/commit/35c194a8fb2aa5051e7f46092418c35821e61890))
    * fix group gestos for strict mode #656 ([311c931](https://github.com/daybrush/moveable/commit/311c93137f9b8aa53b040cda05e94bbae08e313b))
    * fix innerBounds for no width, height ([42fe6f3](https://github.com/daybrush/moveable/commit/42fe6f3d45662c2e46280d4d5a6eed0cc9a05e66))
    * fix svg matrixes #643 ([525ad70](https://github.com/daybrush/moveable/commit/525ad70e2593500188e2a81d2759e726d4277049))
    * support keepRatio for Clippable ([a934512](https://github.com/daybrush/moveable/commit/a934512d2fc38e4a2fee6b6c5834df1b4f6e503e))
* `vue-moveable`
    * fix commonjs issue #650 ([89a5fb6](https://github.com/daybrush/moveable/commit/89a5fb6b4b2c04360db4d341d27668079016a579))


### :memo: Documentation

* update handbook.md (#675) ([dfc428b](https://github.com/daybrush/moveable/commit/dfc428bb2526138856de8ed437183993ba6ffeaa))


### :house: Code Refactoring

* All
    * use yarn workspace ([73da295](https://github.com/daybrush/moveable/commit/73da295064845a3791782c1777a9c555272a0af0))


### :mega: Other

* All
    * publish packages ([3530f05](https://github.com/daybrush/moveable/commit/3530f0526081b0c010e6c964265b466713f0212e))
* `vue3-moveable`, `vue-moveable`, `svelte-moveable`, `react-moveable`, `preact-moveable`, `ngx-moveable`, `moveable`
    * update demo configuration ([917123c](https://github.com/daybrush/moveable/commit/917123cdea2830e8e8f4a8d7b2a99654f16682ef))
* `react-moveable`
    * fix types dependencies ([b4a3ee6](https://github.com/daybrush/moveable/commit/b4a3ee6486a81ca14a7c23284818628471369fe0))
* `moveable`
    * update dependencies ([9ad9efa](https://github.com/daybrush/moveable/commit/9ad9efa2a180c087cd68c1491f19a6226610567b))
* Other
    * fix lerna scripts ([6b6c210](https://github.com/daybrush/moveable/commit/6b6c21005ea028647534e6d11917e1bf8093946e))
    * update release module ([f00caf5](https://github.com/daybrush/moveable/commit/f00caf55c7913a1b1c007489be5d84a8d6b36fd4))



## [0.29.8](https://github.com/daybrush/moveable/compare/0.29.6...0.29.8) (2022-05-01)
### :sparkles: Packages
* `lit-moveable` 0.6.8
* `moveable` 0.29.8
* `preact-moveable` 0.31.8
* `react-compat-moveable` 0.17.8
* `react-moveable` 0.32.7
* `svelte-moveable` 0.21.8
* `vue-moveable` 2.0.0-beta.15
* `vue3-moveable` 0.4.8
* `ngx-moveable` 0.26.8


### :bug: Bug Fix

* `react-moveable`
    * fix coordinate for position: fixed #653 ([87ba56c](https://github.com/daybrush/moveable/commit/87ba56c5728203b6f4bf2cf0f4f004aee009a625))
    * skip beforeEvent set to lastEvent #654 ([5ab31c7](https://github.com/daybrush/moveable/commit/5ab31c749c8a331b40a564b365c75223be0736c2))


### :mega: Other

* All
    * update packages versions ([169c484](https://github.com/daybrush/moveable/commit/169c48417bb4bc07c59e227c545e379dbf43d15b))
* Other
    * update lerna scripts ([6968e1b](https://github.com/daybrush/moveable/commit/6968e1bd004a29e06deebcca87d132082ac7e2c7))



## [0.29.6](https://github.com/daybrush/moveable/compare/0.29.5...0.29.6) (2022-04-27)
### :sparkles: Packages
* `lit-moveable` 0.6.6
* `moveable` 0.29.6
* `preact-moveable` 0.31.6
* `react-compat-moveable` 0.17.6
* `react-moveable` 0.32.5
* `svelte-moveable` 0.21.6
* `vue-moveable` 2.0.0-beta.13
* `vue3-moveable` 0.4.6
* `ngx-moveable` 0.26.6


### :mega: Other

* All
     * update packages versions ([585094f](https://github.com/daybrush/moveable/commit/585094f76ec6e1556159ac357d6ac83ebab953ae))



## [0.29.5](https://github.com/daybrush/moveable/compare/0.29.4...0.29.5) (2022-04-27)
### :sparkles: Packages
* `lit-moveable` 0.6.5
* `moveable` 0.29.5
* `preact-moveable` 0.31.5
* `react-compat-moveable` 0.17.5
* `react-moveable` 0.32.4
* `svelte-moveable` 0.21.5
* `vue-moveable` 2.0.0-beta.12
* `vue3-moveable` 0.4.5
* `ngx-moveable` 0.26.5


### :bug: Bug Fix

* `react-moveable`
    * fix clip bug with draggable, snappable ([b5477ee](https://github.com/daybrush/moveable/commit/b5477ee6a05067a3506bfefac30c36839b264c83))
* `react-compat-moveable`
    * fix rollup config #650 ([72c9f99](https://github.com/daybrush/moveable/commit/72c9f99a2d82ebdbc9de6a99ea6ede817a2c1773))
    * fix rollup config #650 ([b8d1bc7](https://github.com/daybrush/moveable/commit/b8d1bc79ff484e57fcdec43f25c043d8d9b7e7df))


### :memo: Documentation

* fix README ([b56937c](https://github.com/daybrush/moveable/commit/b56937c50054d1b30a038cb29f7290b3e7ca8e8f))


### :mega: Other

* `vue3-moveable`, `vue-moveable`, `svelte-moveable`, `react-compat-moveable`, `preact-moveable`, `ngx-moveable`, `moveable`, `lit-moveable`
    * update packages versions ([5cd2398](https://github.com/daybrush/moveable/commit/5cd2398dbb4dbbda24032641fe5bf111780b75fc))
* `vue-moveable`
    * fix lerna-helper field ([faff016](https://github.com/daybrush/moveable/commit/faff016bbaf2da46b4e5633a0a883c2da99b106b))
* Other
    * fix lerna scripts ([f7840c4](https://github.com/daybrush/moveable/commit/f7840c422ff2c627d357ca6cbfaf244f8e6d64c1))



## [0.29.4](https://github.com/daybrush/moveable/compare/0.29.3...0.29.4) (2022-04-26)
### :sparkles: Packages
* `lit-moveable` 0.6.4
* `moveable` 0.29.4
* `preact-moveable` 0.31.4
* `react-compat-moveable` 0.17.4
* `react-moveable` 0.32.4
* `svelte-moveable` 0.21.4
* `vue-moveable` 2.0.0-beta.11
* `vue3-moveable` 0.4.4
* `ngx-moveable` 0.26.4


### :bug: Bug Fix

* `react-moveable`
    * fix svg transform #643 ([82233ca](https://github.com/daybrush/moveable/commit/82233ca351c4600dea58c6558ccfeaca6a1e8295))


### :memo: Documentation

* fix CHANGELOG ([f6886d6](https://github.com/daybrush/moveable/commit/f6886d6dfc52c6d46cb51289862293d6ac3fd50d))


### :house: Code Refactoring

* `vue3-moveable`, `vue-moveable`, `svelte-moveable`, `preact-moveable`, `moveable`, `lit-moveable`
    * apply `lerna` ([a06c1e2](https://github.com/daybrush/moveable/commit/a06c1e20d11a9e01cef1afebc3dcedfcd243fd79))
* `react-moveable`, `react-compat-moveable`, `ngx-moveable`, `moveable`
    * move core, storybook packages ([2bc3409](https://github.com/daybrush/moveable/commit/2bc340992c5b414ac887b6a1a90e2a3b4949833e))


### :mega: Other

* All
    * update packages versions ([a62ee58](https://github.com/daybrush/moveable/commit/a62ee58b9bc32f06edc95d55ea28b60c20881ac4))
* `vue-moveable`, `svelte-moveable`, `react-moveable`, `react-compat-moveable`, `preact-moveable`, `lit-moveable`
    * upgrade storybook and typescript ([eff23fd](https://github.com/daybrush/moveable/commit/eff23fd7340964ed0e3e6f5930e56558c4d91d18))
* `vue-moveable`
    * fix lerna scripts ([8041d2b](https://github.com/daybrush/moveable/commit/8041d2b20f542681bf5abd4792c95531e53b741d))
* `react-moveable`
    * update typescript version ([a63ee9f](https://github.com/daybrush/moveable/commit/a63ee9f575d701f24748d48ac92484f6c259577f))
* Other
    * fix lerna scripts ([c348e99](https://github.com/daybrush/moveable/commit/c348e9998f471a475a36e884bf2f73b26ca58e64))
    * fix release script ([2de407a](https://github.com/daybrush/moveable/commit/2de407a1e5aca0c196bc545c47f1fce721f5a77f))
    * Release 0.29.3 ([657c900](https://github.com/daybrush/moveable/commit/657c90008181d1ba1567cfcb119bbda51b395130))
    * update lerna module ([0c87482](https://github.com/daybrush/moveable/commit/0c8748245e5735bdfe2a7c141782c07b940755a1))




## [0.29.3] - 2022-04-19
* `moveable` 0.29.3
* `react-moveable` 0.32.3
* `preact-moveable` 0.31.3
* `ngx-moveable` 0.25.3
* `svelte-moveable` 0.19.3
* `lit-moveable` 0.6.3
* `vue-moveable` 2.0.0-beta.10
* `vue3-moveable` 0.4.3

### Fixed
* fix fixed direction for scalable #624
* Support concurrent mode #640

## [0.29.2] - 2022-04-18
* `moveable` 0.29.2
* `react-moveable` 0.32.2
* `preact-moveable` 0.31.2
* `ngx-moveable` 0.25.2
* `svelte-moveable` 0.19.2
* `lit-moveable` 0.6.2
* `vue-moveable` 2.0.0-beta.9
* `vue3-moveable` 0.4.2

### Fixed
* fix `setFixedDirection` for group #624
* fix `dist` for group #639

## [0.29.1] - 2022-04-16
* `moveable` 0.29.1
* `react-moveable` 0.32.1
* `preact-moveable` 0.31.1
* `ngx-moveable` 0.25.1
* `svelte-moveable` 0.19.1
* `lit-moveable` 0.6.1
* `vue-moveable` 2.0.0-beta.8
* `vue3-moveable` 0.4.1

### Fixed
* fix `resizeFormat`

## [0.29.0] - 2022-04-15
* `moveable` 0.29.0
* `react-moveable` 0.32.0
* `preact-moveable` 0.31.0
* `ngx-moveable` 0.25.0
* `svelte-moveable` 0.19.0
* `lit-moveable` 0.6.0
* `vue-moveable` 2.0.0-beta.7
* `vue3-moveable` 0.4.0

### Added
* add `keepRatio` in `Resizable`, `Scalable` request #638
* add `beforeScale`, `beforeResize` events #623 #624
* add `resizeFormat` option #624
* add `beforeRotate`, `beforeRoateGroup` events

### Fixed
* fix dragArea is null #636
* fix dragStart method #629
* fix fixedDirection #624
* fix form element select #631
* fix forceUpdate types
* remove useless param

## [0.28.0] - 2022-03-14
* `moveable` 0.28.0
* `react-moveable` 0.31.1
* `preact-moveable` 0.30.0
* `ngx-moveable` 0.24.0
* `svelte-moveable` 0.18.0
* `lit-moveable` 0.5.0
* `vue-moveable` 2.0.0-beta.6
* `vue3-moveable` 0.3.0

### Added
* add `events` property for groupEnd events #610
* add `useResizeObserver` prop #603
* add `forceUpdate` method #568
* add `transform` property on render events

### Fixed
* fix ngx-moveable's inputs, outputs
* fix clippable transform #608
* fix svg matrix #602
* prevent click event #600
* optimize the update #568
* fix custom ables' class name #583
* fix zoomed cursor #589 #591
* fix scaled container for frameworks #578
* fix className is null and crushing clippable with svg without classes (#584)
* fix svelt ssr #513
* fix Clippable's rotationRad
* fix rotation for custom defined handlers



## [0.27.2] - 2021-11-16
* `moveable` 0.27.2
* `react-moveable` 0.30.2
* `preact-moveable` 0.29.2
* `ngx-moveable` 0.23.2
* `svelte-moveable` 0.18.2
* `lit-moveable` 0.4.2
* `vue-moveable` 2.0.0-beta.5
* `vue3-moveable` 0.2.2


### Fixed
* fix dependencies #553
* fix elementGuidelines #555
* fix vue types #557


## [0.27.1] - 2021-11-10
* `moveable` 0.27.1
* `react-moveable` 0.30.1
* `preact-moveable` 0.29.1
* `ngx-moveable` 0.23.1
* `svelte-moveable` 0.18.1
* `lit-moveable` 0.4.1
* `vue-moveable` 2.0.0-beta.3
* `vue3-moveable` 0.2.1


### Fixed
* fix group matrix #545
* fix start element rects #548


## [0.27.0] - 2021-11-09
* `moveable` 0.27.0
* `react-moveable` 0.30.0
* `preact-moveable` 0.29.0
* `ngx-moveable` 0.23.0
* `svelte-moveable` 0.18.0
* `lit-moveable` 0.4.0
* `vue-moveable` 2.0.0-beta.2
* `vue3-moveable` 0.2.0

### Added
* add `hideDefaultLines` prop #521
* add `snapDirections`, `elementSnapDirections` #511

### Fixed
* fix `throttleDrag` for group #542
* fix property order #540
* fix target transform #533
* trigger click event #543
* `clipTargetBounds` ignores `dragWithClip` #520
* fix zoom matrix #519

### Removed
* Remove `snapCenter`, `snapHorizontal`, `snapVertical`, `snapElement` (Use `snapDirections`, `elementSnapDirections`)
    * `snapCenter: true` same as `snapDirections: { center: true, middle: true }`, `elementSnapDirections: { center: true, middle: true }`
    * `snapHorizontal: true` same as `snapDirections: { top: true, bottom: true }`,
    * `snapVertical: true` same as `snapDirections: { left: true, right: true }`,


## [0.26.0] - 2021-07-11
* `moveable` 0.26.0
* `react-moveable` 0.29.0
* `preact-moveable` 0.28.0
* `ngx-moveable` 0.22.0
* `svelte-moveable` 0.17.0
* `lit-moveable` 0.3.0
* `vue-moveable` 2.0.0-beta.0
* `vue3-moveable` 0.1.0

### Added
* Add `vue-moveable` package
* Add `vue3-moveable` package
* Support multi state

### Fixed
* Fix svg matrix #498
* prevent click event for capturing #490
* Fix types


## [0.25.3] - 2021-06-18
* `moveable` 0.25.3
* `react-moveable` 0.28.3
* `preact-moveable` 0.27.3
* `ngx-moveable` 0.21.3
* `svelte-moveable` 0.16.3
* `lit-moveable` 0.2.3

### Fixed
* Fix snap to grid (bottom) #491
* Prevent click event #490
* Fix Native Event for dragArea or group
* Fix start original transform


## [0.25.2] - 2021-06-16
* `moveable` 0.25.2
* `react-moveable` 0.28.2
* `preact-moveable` 0.27.2
* `ngx-moveable` 0.21.2
* `svelte-moveable` 0.16.2
* `lit-moveable` 0.2.2

### Fixed
* Fixed the problem that left and top dashed guidelines were not visible


## [0.25.1] - 2021-06-16
* `moveable` 0.25.1
* `react-moveable` 0.28.1
* `preact-moveable` 0.27.1
* `ngx-moveable` 0.21.1
* `svelte-moveable` 0.16.1
* `lit-moveable` 0.2.1

### Added
* Add `snapContainer` prop #487
* Add `snapGridWidth`, `snapGridHeight` props #482
* Add `isDisplayInnerSnapDigit` prop #456


### Fixed
* Support svg able #462
* Support start transform for 1.0.0
* Remove overlapping guidelines


## [0.24.6] - 2021-04-21
* `moveable` 0.24.6
* `react-moveable` 0.27.7
* `preact-moveable` 0.26.5
* `ngx-moveable` 0.20.6
* `svelte-moveable` 0.15.
* `lit-moveable` 0.1.6

### Fixed
* Fix svg transform container #446
* Fix onRoundEnd event #440

## [0.24.5] - 2021-03-30
* `moveable` 0.24.5
* `react-moveable` 0.27.5
* `preact-moveable` 0.26.4
* `ngx-moveable` 0.20.5
* `svelte-moveable` 0.15.5
* `lit-moveable` 0.1.5

### Fixed
* Update `@scena/dragscroll` #435


## [0.24.4] - 2021-03-22
* `moveable` 0.24.4
* `react-moveable` 0.27.4
* `preact-moveable` 0.26.3
* `ngx-moveable` 0.20.4
* `svelte-moveable` 0.15.4
* `lit-moveable` 0.1.4

### Fixed
* remove console.log #430




## [0.24.3] - 2021-03-20
* `moveable` 0.24.3
* `react-moveable` 0.27.2
* `preact-moveable` 0.26.2
* `ngx-moveable` 0.20.3
* `svelte-moveable` 0.15.3
* `lit-moveable` 0.1.3

### Fixed
* Resizable not working if the immediate parent of the target has 'display:flex' #430




## [0.24.2] - 2021-03-20
* `moveable` 0.24.2
* `react-moveable` 0.27.1
* `preact-moveable` 0.26.1
* `ngx-moveable` 0.20.2
* `svelte-moveable` 0.15.2
* `lit-moveable` 0.1.2

### Fixed
* Change Moveable control box to use translate3d for z-index support in Safari #433
* groups request("resizable") TypeError: Cannot read property 'target' of undefined #432
* Fix resizable ratio



## [0.24.1] - 2021-03-15
* `moveable` 0.24.1
* `react-moveable` 0.27.0
* `preact-moveable` 0.26.0
* `ngx-moveable` 0.20.1
* `svelte-moveable` 0.15.1
* `lit-moveable` 0.1.1

### Added
* add setRatio function property on scaleStart

### Fixed
* can't resize more than 100px if max-width/height set to 100% #430
* Cannot assign to 'x' because it is a read-only property. #429
* If the container is scaled, call Moveable.request("draggable") translate error React #428
* Scale is not accurately following the cursor when aspect ratio is fixed and the target isn't scaled 1:1 #426


## [0.23.1] - 2021-02-14
* `moveable` 0.23.1
* `react-moveable` 0.26.2
* `preact-moveable` 0.25.2
* `ngx-moveable` 0.19.1
* `svelte-moveable` 0.14.1

### Fixed
* Snap guideline disappear after left changed #415 #416


## [0.23.0] - 2021-01-28
* `moveable` 0.23.0
* `react-moveable` 0.26.0
* `preact-moveable` 0.25.0
* `ngx-moveable` 0.19.0
* `svelte-moveable` 0.14.0

### Added
* Add `rotationTarget` prop #381
* Add `portalContainer` prop #391
* Add `className` property in elementGuidelines #397

### Fixed
* Support svg's `g` tag #407
* Fix rotation cursor #406
* Update element guidelines during drag #404

## [0.22.2] - 2021-01-08
* `moveable` 0.22.2
* `react-moveable` 0.25.1
* `preact-moveable` 0.24.1
* `ngx-moveable` 0.18.2
* `svelte-moveable` 0.13.2

### Fixed
* Fix SVG position #390
* Fix Warpable matrix


## [0.22.1] - 2021-01-04
* `moveable` 0.22.1
* `react-moveable` 0.25.0
* `preact-moveable` 0.24.0
* `ngx-moveable` 0.18.1
* `svelte-moveable` 0.13.1

### Fixed
* Fix number type rendering #386


## [0.22.0] - 2020-12-22
* `moveable` 0.22.0
* `react-moveable` 0.25.0
* `preact-moveable` 0.24.0
* `ngx-moveable` 0.18.0
* `svelte-moveable` 0.13.0

### Added
* Support Custom Able
* Support Tree Shaking (React)
* Support live element guidelines #317
* Support partial element guidelines #357
* Add `setFixedDirection`, `setRatio` properties in Resizable, Scalable #355 #362
* Add `absoluteDist`, `absoluteDelta`, `absoluteRotate` properties #377
* Support function element type

### Fixed
* Fix SVG deletion #359
* Fix Group's dragTarget #373
* Fix Groups' updateTarget #366
* Fix floating point issue  #376
* Fix snapCenter caculation
* Fix guideline scale #380

## [0.21.1] - 2020-11-16
* `moveable` 0.21.1
* `react-moveable` 0.24.1
* `preact-moveable` 0.23.1
* `ngx-moveable` 0.17.1
* `svelte-moveable` 0.12.1

### Fixed
* Fix rotataionPosition's calculation #353
* Fix zoom pixel cracking problem


## [0.21.0] - 2020-11-08
* `moveable` 0.21.0
* `react-moveable` 0.24.0
* `preact-moveable` 0.23.0
* `ngx-moveable` 0.17.0
* `svelte-moveable` 0.12.0

### Added
* Add `individualGroupable` prop
* Add `getManager` method
* Add `mouseEnter`, `mouseLeave` events #342
* Add `props` prop for custom ables

### Fixed
* Fix `edgeDraggable` prop #330
* Change `hitTest`, `isInside` algorithm.

## [0.20.0] - 2020-10-28
* `moveable` 0.20.0
* `react-moveable` 0.23.0
* `preact-moveable` 0.22.0
* `ngx-moveable` 0.16.0
* `svelte-moveable` 0.11.0

## [0.20.1] - 2020-10-31
* `moveable` 0.20.1
* `react-moveable` 0.23.1
* `preact-moveable` 0.22.1
* `ngx-moveable` 0.16.1
* `svelte-moveable` 0.11.1

### Fixed
* fix typo #343

## [0.20.0] - 2020-10-28
* `moveable` 0.20.0
* `react-moveable` 0.23.0
* `preact-moveable` 0.22.0
* `ngx-moveable` 0.16.0
* `svelte-moveable` 0.11.0

### Added
* Add `minRoundControls`, `maxRoundControls`, `roundClickable` props for roundable #338
* Add `edgeDraggable` prop #330

### Fixed
* Fix rotation direction #332
* Fix svg transform origin in safari #334
* Fix svg className #337
* when rotate to 90/180/270 deg, resize bug. #333


## [0.19.4] - 2020-10-10
* `moveable` 0.19.4
* `react-moveable` 0.22.6
* `preact-moveable` 0.21.6
* `ngx-moveable` 0.15.4
* `svelte-moveable` 0.10.5

### Fixed
* remove console.log for npm #329


## [0.19.3] - 2020-09-19
* `moveable` 0.19.3
* `react-moveable` 0.22.6
* `preact-moveable` 0.21.5
* `ngx-moveable` 0.15.3
* `svelte-moveable` 0.10.4

### Fixed
* Fix svelte-moveable types #320
* Fix rootContainer is not worked #318

## [0.19.2] - 2020-09-16
* `moveable` 0.19.2
* `react-moveable` 0.22.5
* `preact-moveable` 0.21.4
* `ngx-moveable` 0.15.2
* `svelte-moveable` 0.10.2

### Fixed
* Fix dragging a control and dragging does not occur on the target

## [0.19.1] - 2020-09-15
* `moveable` 0.19.1
* `react-moveable` 0.22.3
* `preact-moveable` 0.21.3
* `ngx-moveable` 0.15.1
* `svelte-moveable` 0.10.1

### Added
* Export `getElementInfo` function (moveable, react-moveable)
* Add `translateZ` prop. #302
* Support `click`, `clickGroup` event for no `dragArea` #309
* Add `passDragArea` prop #309
* Add `clipVerticalGuidelines`, `clipHorizontalGuidelines`, `clipTargetBounds`, `clipSnapThreshold` props #292
* Support target's string, React.RefObject type #275 #290

### Fixed
* Support Tree Shaking #15
* Change `Dragger` to `gesto`
* Fix agent issue #310
* resizable request is not worked #312


## [0.18.5] - 2020-07-17
* `moveable` 0.18.5
* `react-moveable` 0.21.6
* `preact-moveable` 0.20.7
* `ngx-moveable` 0.14.3
* `svelte-moveable` 0.9.3

### Fixed
* Fix Safari Offset Calculation #285
* Fix SVG Transform Origin Calculation #286
* Fix SVG ClientSize Calculation #288


## [0.18.4] - 2020-07-15
* `moveable` 0.18.4
* `react-moveable` 0.21.5
* `preact-moveable` 0.20.6
* `ngx-moveable` 0.14.2
* `svelte-moveable` 0.9.2

### Fixed
* Remove react types #273 #284



## [0.18.3] - 2020-07-14
* `moveable` 0.18.3
* `react-moveable` 0.21.4
* `preact-moveable` 0.20.5
* `ngx-moveable` 0.14.1
* `svelte-moveable` 0.9.1

### Fixed
* Remove react types #284

## [0.18.2] - 2020-07-13
* `moveable` 0.18.2
* `react-moveable` 0.21.3
* `preact-moveable` 0.20.4
* `ngx-moveable` 0.14.0
* `svelte-moveable` 0.9.0

### Added
* Add `roundable` props
* Add `originDraggable` props #169
* Add `clippable` props
* Add `cspNonce` props #279
* Add `setMin`, `setMax` property in resizable event #231 #256
* Add `top-left`, `top-right`, ...etc 8 direction value for rotatable #259
* Add `moveable-dragging` className #268
* Add `lastEvent` property #262

### Fixed
* Fix angular dependecies #274
* Fix `@daybrush/utils` types #273
* Fix zero dist issue #264
* Fix that innerBounds not works and change bounds color

## [0.17.10] - 2020-06-08
* `moveable` 0.17.10
* `react-moveable` 0.20.10
* `preact-moveable` 0.19.10
* `ngx-moveable` 0.13.11
* `svelte-moveable` 0.8.11


### Fixed
* resize could go outside the configured boundaries #253


## [0.17.9] - 2020-06-05
* `moveable` 0.17.9
* `react-moveable` 0.20.9
* `preact-moveable` 0.19.9
* `ngx-moveable` 0.13.10
* `svelte-moveable` 0.8.10


### Fixed
* Fix Resize issue when container has keepRatio + rotated + with snapGuideLines #235 #251 #253
* Fix contextmenu issue #252



## [0.17.8] - 2020-05-31
* `moveable` 0.17.8
* `ngx-moveable` 0.13.9
* `svelte-moveable` 0.8.9

### Fixed
* Fix CSS's camelized name issue #243



## [0.17.7] - 2020-05-30
* `moveable` 0.17.7
* `react-moveable` 0.20.8
* `preact-moveable` 0.19.8
* `ngx-moveable` 0.13.8
* `svelte-moveable` 0.8.8

### Fixed
* Fix CSS's camelized name issue #243
* Fix wrong maxWidth, maxHeight calculation issue for `innerBounds` and `bounds`  #221 #245 #241 #235
* Remove `@types/react` , `@types/react-dom` #240
* Fix `@daybrush/drag`'s version issue #239


## [0.17.6] - 2020-05-18
* `moveable` 0.17.6
* `react-moveable` 0.20.7
* `preact-moveable` 0.19.7
* `ngx-moveable` 0.13.7
* `svelte-moveable` 0.8.7

### Fixed
* Fix firefox's getBoundingClientRect issue #234
* Fix that zoom is not working

## [0.17.5] - 2020-05-07
* `moveable` 0.17.5
* `react-moveable` 0.20.6
* `preact-moveable` 0.19.6
* `ngx-moveable` 0.13.6
* `svelte-moveable` 0.8.6

### Fixed
* Fix client position #220
* Calculate min, max size for Resizable #231

## [0.17.4] - 2020-05-05
* `moveable` 0.17.4
* `react-moveable` 0.20.5
* `preact-moveable` 0.19.5
* `ngx-moveable` 0.13.5
* `svelte-moveable` 0.8.5

### Fixed
* Fix that getElement() is not a function #228

## [0.17.3] - 2020-05-05
* `moveable` 0.17.3
* `react-moveable` 0.20.4
* `preact-moveable` 0.19.4
* `ngx-moveable` 0.13.4
* `svelte-moveable` 0.8.4

### Fixed
* Fix duplicated drag are and padding area.
* Fix that click event is not fired. #228

## [0.17.2] - 2020-05-03
* `moveable` 0.17.2
* `react-moveable` 0.20.3
* `preact-moveable` 0.19.3
* `ngx-moveable` 0.13.2
* `svelte-moveable` 0.8.2

### Fixed
* Fix padding's background color
* Fix first rendering issue

## [0.17.1] - 2020-05-03
* `moveable` 0.17.1
* `react-moveable` 0.20.1
* `preact-moveable` 0.19.1
* `ngx-moveable` 0.13.1
* `svelte-moveable` 0.8.1

### Added
* Add `padding`, `dragTarget` props #148 #127 #156 #217
* Add `snapDistFormat` props #222 #209 #229
* Add `pinchOutside` props  #139
* Add `hitTest` method #226

### Fixed
* Error: @Output click not initialized in 'NgxMoveableComponent' #228
* In main demo, if the keyboard arrow is held down, drag feature eventually breaks #225
* Moveable.request does not work in groupable #220
* Element Guidelines when parent is scaled #219


## [0.16.3] - 2020-04-04
* `moveable` 0.16.3
* `react-moveable` 0.19.2
* `preact-moveable` 0.18.2
* `ngx-moveable` 0.12.2
* `svelte-moveable` 0.7.2

### Fixed
* isPinch is undefined during onDrag (when actually pinching on mobile) #212, #213
* Pinch Central Problem #139


## [0.16.2] - 2020-04-01
* `moveable` 0.16.2
* `react-moveable` 0.19.1
* `preact-moveable` 0.18.1
* `ngx-moveable` 0.12.1
* `svelte-moveable` 0.7.1

### Fixed
* Fix SVG Firefox Issue #211
* when isDisplaySnapDigit={false} the number is displayed but set to 0 #200


## [0.16.1] - 2020-03-31
* `moveable` 0.16.1
* `react-moveable` 0.19.0
* `preact-moveable` 0.18.0
* `ngx-moveable` 0.12.0
* `svelte-moveable` 0.7.0

### Added
* Add `snapGap` props #200
* Add `onSnap` event #204
* Add `triggerAblesSimultaneously` props #207
* Add `isDragging` method

### Fixed
* scrollGroup is not working #208
* Race condition when react-moveable is unmounted bug #197
* Resizing diagonal corners didn't snap.

## [0.15.2] - 2020-03-05
* `moveable` 0.15.2
* `react-moveable` 0.18.1
* `preact-moveable` 0.17.1
* `ngx-moveable` 0.11.1
* `svelte-moveable` 0.6.1


### Fixed
* Fix rootContainer for 2d transform #137

## [0.15.1] - 2020-03-05
https://github.com/daybrush/moveable/milestone/8

* `moveable` 0.15.1
* `react-moveable` 0.18.0
* `preact-moveable` 0.17.0
* `ngx-moveable` 0.11.0
* `svelte-moveable` 0.6.0

### Added
* Support `scrollable`, `onScroll` for resizable, scalable #180
* Add `zoom` props #158
* Add `rootContainer` props with Absolute Container Matrix(SVG, elementGuidelines is not supported) #137 #163
* Add `snapDigit` props #173
* Add `isDisplaySnapDigit` props #186
* Add `innerBounds` props #172
* Add `request` method (Draggable, Resizable, Rotatable, Scalable) #141

### Fixed
* Fix Portal issue #187

## [0.14.1] - 2020-02-05
* `moveable` 0.14.1
* `ngx-moveable` 0.10.1
* `svelte-moveable` 0.5.1

### Fixed
* Update `react-simple-compat` 0.1.2.
* When I set the property target of moveable to array, it will not work！ #171

## [0.14.0] - 2020-02-03
* `moveable` 0.14.0
* `react-moveable` 0.17.0
* `preact-moveable` 0.16.0
* `ngx-moveable` 0.10.0
* `svelte-moveable` 0.5.0

### Added
* Add `throttleDragRotate` #145
* Support for displaying snap distances in elementGuidelines #142
* Support bounds for a rotated system #106 #163

### Fixed
* Change `preact` to `react-simple-compat` #129
* Change Rotation handle CSS #167
* Fixed an issue where the origin was reset when the `resizable` option was toggled #168
* Change the scrollable behavior to `@scnea/dragscroll`

## [0.13.4] - 2020-01-12
* `moveable` 0.13.4
* `react-moveable` 0.16.6
* `preact-moveable` 0.15.5
* `ngx-moveable` 0.9.4
* `svelte-moveable` 0.4.4

### Fixed
* Fixed that control points rotation is wrong bug #151
* Fixed that Scrollable isn't working. (wrong calculation) #150
* Fixed that Crash of ngx-moveable when using --prod on angular bug #129

## [0.13.3] - 2019-12-30
* `moveable` 0.13.3
* `react-moveable` 0.16.4
* `preact-moveable` 0.15.3
* `ngx-moveable` 0.9.3
* `svelte-moveable` 0.4.3

### Fixed
* Fixed the problem that resize and scale occur simultaneously
* Change CSS Module (css-styler => css-styled)
* Update @moveable/matrix #128

## [0.13.2] - 2019-12-26
* `moveable` 0.13.2
* `react-moveable` 0.16.3
* `preact-moveable` 0.15.2
* `ngx-moveable` 0.9.2
* `svelte-moveable` 0.4.2

### Fixed
* Fixed error that warp event does not occur in warpable.
* Fixed minor differences in Snappable #121
* Fixed a problem where the scale of a group was only keepRatio. #124
* Fixed pinchable not working.
* Fixed snappable not working. #127
* Update @moveable/matrix #128

## [0.13.1] - 2019-12-13
### Fixed
* Fix Snappable for dymaic guidelines (vertical, horizontal) #119
* Element snaps with elementGuideline and verticalGuideline at the same posiiton #121

## [0.13.0] - 2019-12-12
* `moveable` 0.13.0
* `react-moveable` 0.16.1
* `preact-moveable` 0.15.0
* `ngx-moveable` 0.9.0
* `svelte-movable` 0.4.0

### Added
* Add `snapVertical`, `snapHorizontal`, `snapElement` props. #119
* Add `set` method on rotateGroup event. #107
* Add dashed line in element guidelines. #120

### Fixed
* moveable-control is abnormally rotated. #115
* Element snaps with elementGuideline and verticalGuideline at the same posiiton #121
* Huge width value on resizing rotated element on guidelines #122
* Weird snapping with rotated groupables #112
* Input box failed to get focus #110
* Snappable with Scalable does not work. #108

## [0.12.0] - 2019-11-28
### Added
* Add `defaultGroupRotate` props. #102

### Fixed
* Fix that `clickGroup` does not trigger after rotating #103
* Fix that at certain angles, moveable-control handle gets cut #104
* Fix that Element "sliding" when resizing #104

## [0.11.1] - 2019-11-23
### Fixed
* Fix Resizable's base direction calculation

## [0.11.0] - 2019-11-23
### Added
* Add `baseDirection` props.
* Add `offsetWidth`, `offsetHeight` in `getRect`'s method return value. #99

### Fixed
* Fix Resizable's wrong position calculation #99
* Fixed the problem that resize can't snap


## [0.10.8] - 2019-11-21
### Fixed
* Fix Resizable's wrong position calculation
* Fixes incorrect import issue in Preact.


## [0.10.5] - 2019-11-15
### Fixed
* Fixed calculation of client, offset position considering borderWidth.
* Fixed zero scale


## [0.10.4] - 2019-11-15
### Fixed
* Fixes incorrect calculation when parent element is static in safari.

## [0.10.2] - 2019-11-12
### Fixed
* Fix that scale or resize with `keepRatio`, snap is wrong.

## [0.10.1] - 2019-11-12
### Fixed
* Fix that guidelines do not appear when dragging.

## [0.10.0] - 2019-11-09
### Added
* Add `scrollable` props. #39
    * Add `onScroll`, `onScrollGroup` event
    * Add `scrollContainer` props
    * Add `getScrollPosition` props
* Add `currentTarget` and `inputEvent` on all events #74 #86
* Add `setState` method #82
* Add `getRect` method #71
* Add `renderDirection` props #63
* Add `className` props #53 #63
* Add `onClick` event
* Add `onRenderStart`, `onRender`, `onRenderEnd` events #52
* Add `onRenderGroupStart`, `onRenderGroup`, `onRenderGroupEnd` events #52
* Add `warp` in top, right, bottom and left directions.

### Fixed
* Fix target's boundingRect matrix calculation with scroll position
* Fix problem where the ratio is not maintained with keepRatio #70
* Fix that `el is undefined` #73
* Fix `dragArea`'s calculation
* Fix that `dragStart` method is not work with group
* Fix that `clickGroup` event occurs when `dragStart` a mousedown target
* Fix that Moveable is deleted when a single target is changed to multiple targets

## [0.9.8] - 2019-10-26
### Fixed
* Fix that miscalculate static parent's offset position
* Fix dragArea's transformOrigin

## [0.9.7] - 2019-10-16
### Fixed
* Fix typo that `elemenGuildelines` to `elementGuidelines` #62


## [0.9.6] - 2019-10-14
### Fixed
* Update PreactX
* fix that setState is not a function #56

## [0.9.5] - 2019-10-02
### Fixed
* fix that parent drag event occur snap.

## [0.9.4] - 2019-10-02
### Fixed
* fix that resizing north, west direction occur decimal point issue.
* Disable pinchable with snappable.
* Fix offset calculation for Webkit

## [0.9.3] - 2019-10-01
### Fixed
* fix that keepRatio want to behave like sketches and illustrators. #47
* fix keepRatio default false


## [0.9.2] - 2019-10-01
### Fixed
* fix that bounds don't apply when snap

## [0.9.1] - 2019-09-30
### Fixed
* remove console.log

## [0.9.0] - 2019-09-29
### Added
* Add Snappable (Drag, Resize, Scale, Warp) (#6)
* Add `horizontalGuidelines` & `verticalGuidelines` & `elementGuidelines` (#6)
* Add `bounds` option (boundaries) (#23, #24)
* Add `rotationPositoin` option for rotation handle position (#40)
* Add `dragArea` option (#38)
* Add `dragStart` event on `resizeStart`, `scaleStart`. (#9)
* Add `drag` event on `resize`, `scale`. (#9)
* Add `set` parameter function on `warpStart`.


### Fixed
* north and west controls want to behave like photoshop (#9)
* Fix offset calculation for Webkit


## [0.8.0] - 2019-08-28
### Added
- Add `pinchThreshold` option that set minimum distance to pinch easily.
- Add `events` parameter for all `groupStart` event. (such as `onDragGroupStart`, `onScaleGroupStart`, ...etc)
- Add `clickGroup` event to find clicked target in the group
- Add `set` event method for all `start` event for absolute value. (such as `onDragStart`, `onScaleStart`, ...etc) #16
- Add `dragStart` method for external mouse, touch event.
- Add `isInside` method that the coordinates are inside Moveable


### Fixed
- Update @daybrush/drag@0.9.1
- Fix the way dist is used in `onScale` event

## [0.7.5] - 2019-08-24
### Fixed
- Update @daybrush/drag@0.8.2

## [0.7.4] - 2019-08-24
### Fixed
- Fix that pinch does not occur when pressed at the same time.
- Fix that scrolls and drags occur simultaneously and racks occur. #27
- Fix that mis-calculating when a static element is a parent.1 #28
- Fix that destroy() error #30

## [0.7.3] - 2019-08-23
### Fixed
- Fix infinite loop issue.

## [0.7.2] - 2019-08-21
### Fixed
- Remove react types.

## [0.7.1] - 2019-08-20
### Fixed
- Remove unnecessary code.

## [0.7.0] - 2019-08-20
### Added
- Add [Groupable](https://github.com/daybrush/moveable/blob/master/groupable.md)
- Add edge option

### Fixed
- fix that do not call `resizeEnd` #19


## [0.6.4] - 2019-08-07
### Fixed
- fix ESM config

## [0.6.3] - 2019-08-07
### Fixed
- fix missing throttleScale

## [0.6.2] - 2019-08-07
### Fixed
- Update framework-utils and It reduced sizes by 2 kb based on min file.

## [0.6.1] - 2019-08-06
### Fixed
- fix destroy method for property release issue. #18

## [0.6.0] - 2019-08-06
### Added
- Support SVG Elements #13
- Support SVG Transform Origin in Safari, iOS #13
- Add datas parameter to send data #12
- Add pinchable option and events #11

### Fixed
* The default value of `container` option is fixed to `parentElement`.
* Fix Rotatable for distorted axis.

## [0.5.0] - 2019-07-31
### Added
- Add destroy method. #14

### Fixed
- Fix that the getter method gets incorrect values.

## [0.4.1] - 2019-07-29
### Fixed
- Fix that the `warpEnd` event didn't call

## [0.4.0] - 2019-07-29
### Added
- Add Warpable and option, events
- Support SVG Offset (Only SVG Tag)
- Support 3d transform(matrix) (`perspective` is not yet supported.)

### Fixed
- Fix right mouse click issue #7
- Synchronize target's shape. (Previously, it worked independently of target's shape.)
