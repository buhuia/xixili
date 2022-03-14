# 微信外卖小程序。
项目主要目的为学习，代码风格可能不太好，也有冗余部分，哪位大神看不顺眼可以指点一下，谢谢~我虚心学习，后续可能还会写vue版本的。学习一下vue

由于属于个人开发者，无法发布餐饮/外卖小程序。微信支付模块需要300元开启服务，也没集成。所以只有开发者可演示，演示视频地址：

https://www.bilibili.com/video/BV1nP4y137cz/

https://www.bilibili.com/video/BV1hQ4y1i7VE/


<img src="https://user-images.githubusercontent.com/33677284/144193109-1b19f15e-4142-4cae-a63b-7e5e34f7ce26.jpg" width="20%"><img src="https://user-images.githubusercontent.com/33677284/144194084-0bfe549a-a0f2-4aa9-bb73-7c7f5d8b8245.jpg" width="20%"><img src="https://user-images.githubusercontent.com/33677284/144193145-444a4f8b-afd3-4407-85f2-cc7676bc8675.jpg" width="20%"><img src="https://user-images.githubusercontent.com/33677284/144193168-a2c4b799-a875-4dd9-adf7-b10dc2c21d31.jpg" width="20%"><img src="https://user-images.githubusercontent.com/33677284/144193183-e77a5b9c-449a-406a-a874-0cef0f300828.jpg" width="20%"><img src="https://user-images.githubusercontent.com/33677284/144193217-57d0173c-2966-4232-8307-5890217d67e5.jpg" width="20%"><img src="https://user-images.githubusercontent.com/33677284/144193242-9023089d-ec2a-454b-8be0-68dcb860d14e.jpg" width="20%">

## 后台部分
纯原生开发，后台使用云函数。后台配置遵循微信小程序官方指导即可。云开发使用按量付费，仅开发的话免费配额就够用了。

后台模型和数据我都已导出，在/数据库数据中。

PS.不知道是云服务bug还是啥，每周会扣1分钱的样子。我充了1块，目前还正常使用。

## UI部分
UI目前有原生组件，官方weUI，以及vant weapp。

官方weUI只需要在app.json配置文件内useExtendedLib即可使用。

vant weapp则按照有赞官方指导，用npm引入。

# 项目导入
1、需要自己注册微信小程序开发账号（如果要发布，需要注册企业小程序开发，个人小程序开发不允许发布餐饮外卖小程序）。

2、下载小程序开发工具。

3、申请云服务，我的是按量收费，基本免费配额够用。这部分可能在代码里**需要修改的部分比较多，主要是云服务初始化需要改为你自己的，可以搜wx.cloud.init，把env改成自己的**。

4、开启云开发里内容管理部分，**导入我上传的数据库模型和数据库数据，数据库权限需要设置为所有人可读。** 就可以展示了。

5、可能遇到的问题：地址管理模块引入了腾讯地图sdk,也**需要配置，更改源码**。参考官方指导https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview

# 已知问题
1、 数据库图片无法导入，因为微信云数据库导出的json格式无法导出具体的图片实例，只是导出了图片储存的地址，这个地址是我自己数据库的地址，试着玩的小伙伴导入数据库后是无法拿到图的，所以首页轮播图，菜单图片都会挂掉，这个暂时我也想不出好办法。只能大家自己再上传一些图了。如果有好的办法，请分享出来帮忙解决一下这个问题，谢谢

## 有疑问可联系13201688133~


