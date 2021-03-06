# Parallel Text Editor with TEI

アンカーを使ったパラレルテキスト作成支援ツール

https://tei-eaj.github.io/parallel_text_editor/app/#/

## 使用方法デモ

https://youtu.be/hOp_PxYUrZk

## サンプル

https://tei-eaj.github.io/parallel_text_editor/app/#/?main=https://genji.dl.itc.u-tokyo.ac.jp/data/tei/koui/01.xml&sub=https://genji.dl.itc.u-tokyo.ac.jp/data/tei/yosano/01.xml

## 使用方法

### データ読み込み

画面右上のプラスアイコンをクリックし、TEI/XMLファイルを読み込んでください。

### アンカーの挿入

画面右部から挿入対象の要素をクリックしてください。挿入対象要素のIDが赤色になります。

画面左部から要素を挿入したい行を探し、行頭の編集アイコンまたは当該行のダブルクリックしてください。

編集ダイアログが表示されたら、要素を挿入したい箇所より後のテキスト部分をフォームに入力してください。挿入対象要素のIDは自動で入力されます。確認後、追加ボタンをクリックして、アンカーが挿入されていることを確認してください。

画面左部の挿入されたアイコンにマウスを重ねると、画面右部の該当要素がハイライトされます。クリックすると、画面内スクロールが実行されます。

同様に、画面右部の該当テキストにマウスを重ねると、画面左部の該当アンカーがハイライトされます。クリックすると、画面内スクロールが実行されます。

### アンカーの削除

編集ダイアログに表示される削除ボタンをクリックしてください。

### データのエクスポート

画面右上のエクスポートアイコンから、編集結果を反映したTEI/XMLファイルまたはJSONファイルをエクスポートすることができます。

### データのインポート

画面右上のインポートアイコンから、編集結果のJSONファイルをインポートすることができます。

## その他

上記のデータのエクスポートとインポートを基本としますが、編集内容はローカルストレージに保存されます。そのため同一ブラウザで再度アクセスすると、作業を継続することができます。
